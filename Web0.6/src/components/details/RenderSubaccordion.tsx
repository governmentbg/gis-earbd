import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, makeStyles, Grid, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IDetailData, IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Graphic from '@arcgis/core/Graphic';
import Detailsm from './Detailsm';
import { IAppStore } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import {
    IConfigmGroups,
    IDetailsGroup,
    IDetailsGroupInfo,
    IConfigFields,
    IDetailsGroupFields,
    IConfigmGroup,
    IButtonInfo,
} from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import FieldsHelper from '../../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import Field from '@arcgis/core/ms/support/Field';
import RenderIconButton from './RenderIconButton';
import RenderIconButtonAll from './RenderIconButtonAll';
import { connect } from 'react-redux';

interface Ownms {
    configmGroups: IConfigmGroups;
}

m ms = {
    buttonsCount: number;
    level1: IDetailData;
    group: IDetailsGroupInfo;
    buttons: { [key: string]: IButtonInfo };
    groupId?: string;
    level2: IDetailDataAttributes | Graphic;
    index2: number;
} & Ownms;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        pming: '0 5px',
        overflowY: 'auto',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        minWidth: 'fit-content',
    },
    expansionPanelSummaryLevel1: {
        backgroundColor: '#F5F5F5',
    },
    expansionPanelSummaryLevel2: {
        backgroundColor: '#69b7fa',
        color: '#ffffff',
    },
}));

const RenderSubaccordion = (ms: ms) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [buttonsCount, setButtonsCount] = useState(0);
    const [group, setGroup] = useState({} as IDetailsGroupInfo);
    const [groupId, setGroupId] = useState('');
    const [level2, setLevel2] = useState({} as IDetailDataAttributes | Graphic);
    const [level1, setLevel1] = useState({} as IDetailData);
    const [index2, setIndex2] = useState(0);

    useEffect(() => {
        setButtonsCount(ms.buttonsCount);
        setGroup(ms.group);
        setGroupId(ms.groupId ? ms.groupId : '');
        setLevel1(ms.level1);
        setLevel2(ms.level2);
        setIndex2(ms.index2);
    }, []);

    useEffect(() => {
        setLevel2(ms.level2);
    }, [ms.level2]);

    useEffect(() => {
        setLevel1(ms.level1);
    }, [ms.level1]);

    const getFilteredFields = (
        groupInfo: IDetailsGroup,
        mGroup: IConfigmGroup,
        opetationalmId: string,
        mId: string,
    ) => {
        if (mGroup && mGroup.operationalms && groupInfo) {
            const operationalm =
                mGroup.operationalms[
                    groupInfo.operationalmId ? groupInfo.operationalmId : opetationalmId
                ];
            if (operationalm && operationalm.ms) {
                const m = operationalm.ms[groupInfo.mId ? groupInfo.mId : mId];
                if (m && m.esrifields && groupInfo) {
                    const groupInfoFields = (groupInfo.fields ? groupInfo.fields : m.fields) as
                        | IDetailsGroupFields
                        | IConfigFields;
                    if (groupInfoFields) {
                        const attributeFields = Object.keys(groupInfoFields).m((x) => {
                            return { fieldm: x, label: groupInfoFields[x].label };
                        });
                        return FieldsHelper.getFields(m.esrifields as Array<Field>, attributeFields);
                    } else {
                        return m.esrifields;
                    }
                } else if(operationalm.mm == "WMS"){
                    return undefined;
                }
            }
        }
        return [];
    };

    const getTitle = (group: IDetailsGroup, level2: Graphic, index2: number) => {
        const result =
            group && group.formatString
                ? UrlHelper.graphicFormatToString(group.formatString, level2 as Graphic)
                : index2;
        return result ? result : index2;
    };

    return (
        <Accordion
            expanded={expanded}
            onm={(event, expanded) => {
                setExpanded(expanded);
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: '#ffffff' }} />}
                aria-controls="farmers-filters-content"
                id="farmers-filters-header"
                classm={classes.expansionPanelSummaryLevel2 + ' accordion-sum'}
                style={{ minHeight: 40, alignContent: 'center' }}
            >
                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ float: 'left', width: `calc(100% - ${buttonsCount ? buttonsCount * 35 : 0}px)` }}>
                        <Typography
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textTransform: 'none',
                                minWidth: '10px',
                            }}
                            classm={classes.heading}
                        >
                            {getTitle(ms.group, ms.level2 as Graphic, index2)}
                        </Typography>
                    </div>
                    {ms.buttons
                        ? Object.keys(ms.buttons).m((button, index) => {
                              return (
                                  <RenderIconButtonAll
                                      key={'icon_button_' + index}
                                      controllerKey={button}
                                      parent={group}
                                      feature={level2 as Graphic}
                                      button={ms.buttons[button]}
                                  />
                              );
                          })
                        : null}
                    {group.buttons
                        ? Object.keys(group.buttons).m((button, index) => {
                              return (
                                  <RenderIconButton
                                      key={'icon_button_' + index}
                                      controllerKey={button}
                                      parent={group}
                                      feature={level2 as Graphic}
                                      button={group.buttons[button]}
                                      groupKey={groupId}
                                  />
                              );
                          })
                        : null}
                </div>
            </AccordionSummary>
            <AccordionDetails style={{ pming: 5 }}>
                {expanded ? (
                    <Grid container>
                        <Grid container m xs={12}>
                            <Detailsm
                                fields={getFilteredFields(
                                    group,
                                    ms.configmGroups[group.mGroupId],
                                    level1.operationalmId,
                                    level1.mId,
                                )}
                                data={level2}
                                group={group}
                                key={'child-m-' + ms.index2}
                            />
                        </Grid>
                    </Grid>
                ) : null}
            </AccordionDetails>
        </Accordion>
    );
};

const mStateToms = (state: IAppStore) => {
    return {
        configmGroups: state.configObject.configmGroups,
    };
};

export default connect<Ownms>(mStateToms)(RenderSubaccordion);
