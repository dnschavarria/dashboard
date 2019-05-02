import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import {injectIntl} from 'react-intl';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import indigo from '@material-ui/core/colors/indigo';
import LaunchIcon from '@material-ui/icons/Launch';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';

import config from 'config';

import { makeSelectUser, makeSelectSchemas } from 'containers/App/selectors';
import { getSchemasRequest } from 'containers/App/actions';

import StyledButtonLink from 'components/StyledButtonLink';

const StyledLink = styled.a`
    text-decoration: none;
    color: white;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        color: white;
    }
`;

export class SchemasPanel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            schemasFilter: ``
        };
    }

    componentWillMount() {
        this.props.dispatch(getSchemasRequest());
    }

    render() {
        let schemasFilter = false;
        let schemasComponents = [];
        if (this.props.schemas) {
            schemasFilter = (<Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                    <SearchIcon />
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        placeholder={this.props.intl.formatMessage({id: `Filter`})}
                        value={this.state.schemasFilter}
                        onChange={(event) => { this.setState({ schemasFilter: event.target.value }) }} />
                </Grid>
            </Grid>);

            this.props.schemas.map((item, index) => {
                if (this.state.schemasFilter === `` || (item.schema.indexOf(this.state.schemasFilter) > -1 || item.schema.indexOf(this.state.schemasFilter) > -1)) {
                    let databaseName = ``;
                    if (this.props.user.parentDb) {
                        databaseName = this.props.user.parentDb;
                    } else {
                        databaseName = this.props.user.screenName;
                    }

                    let numberOfLayers = (item.count ? item.count : 0);
                    schemasComponents.push(<ExpansionPanel key={`schema_card_${index}`} defaultExpanded={false}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography><ExploreIcon/> {item.schema}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={8} direction="row">
                                <Grid item style={{flex: `0 0 50%`}}>
                                    <Typography>
                                        <FormattedMessage id="Number of layers"/>: <strong>{numberOfLayers}</strong>
                                    </Typography>                                    
                                </Grid>
                                <Grid item style={{flex: `0 0 50%`, textAlign: `right`}}>
                                    <StyledLink href={`${config.vidiUrl}app/${databaseName}/${item.schema}`} target="_blank" style={{marginRight: `10px`}}>
                                        <Button color="primary" variant="contained" size="small">
                                            <LaunchIcon/> Vidi
                                        </Button>
                                    </StyledLink>

                                    <StyledButtonLink to={`/admin/${databaseName}/${item.schema}`}>
                                        <Button variant="contained" size="small">
                                            <SettingsIcon />
                                        </Button>
                                    </StyledButtonLink>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>);
                }
            });
        }

        if (schemasComponents.length === 0) {
            if (this.state.schemasFilter === ``) {
                schemasComponents = (<p>
                    <FormattedMessage id="No schemas yet"/>
                </p>);
            } else {
                schemasComponents = (<p>
                    <FormattedMessage id="No schemas found"/>
                </p>);
            }
        }

        return (<div>
            <div>
                <Grid container spacing={8} direction="row" justify="flex-end">
                    <Grid item>{schemasFilter}</Grid>
                </Grid>
            </div>
            <div style={{paddingTop: `10px`}}>{schemasComponents}</div>
        </div>);
    }
}

const mapStateToProps = createStructuredSelector({
    user: makeSelectUser(),
    schemas: makeSelectSchemas()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(injectIntl(SchemasPanel));
