import React from 'react';
import { useEffect, useState } from 'react';
import {
    Typography,
    makeStyles,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    marProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IDetailData, IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Graphic from '@arcgis/core/Graphic';
import {
    IDetailsGroupInfo,
    IConfigOperationalm,
    IConfigm,
    IDetailsGroupFields,
    IUrlInfo,
    IButtonInfo,
} from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import { appConfig } from '../../../../../Lib/v0.6/src/Base/configs/appConfig';
import EventsManager from '../../../../../Lib/v0.6/src/ActionsController/EventsManager';
import RenderIconGroupButton from './RenderIconGroupButton';
import RenderSubaccordion from './RenderSubaccordion';
import RenderIconGroupButtonAll from './RenderIconGroupButtonAll';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        minWidth: 'fit-content',
    },
    expansionPanelSummaryLevel1: {
        backgroundColor: '#F5F5F5',
    },
}));

const RenderAccordion = (ms: {
    index1: number;
    level1: IDetailData;
    detailGroups: { [key: string]: IDetailsGroupInfo };
    detailInfo: {
        enabled: boolean;
        groups: {
            [key: string]: IDetailsGroupInfo;
        };
        buttons: { [key: string]: IButtonInfo };
        groupButtons: { [key: string]: IButtonInfo };
        warningMessage: {
            label: string;
            iconUrl: IUrlInfo;
        };
    };
}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [level1, setLevel1] = useState({} as IDetailData);
    const [index1, setIndex1] = useState(0);
    const [key, setKey] = useState('');
    const [buttonsGroupCount, setButtonsGroupCount] = useState(0);
    const [buttonsCount, setButtonsCount] = useState(0);
    const [group, setGroup] = useState({} as IDetailsGroupInfo);
    const [groupId, setGroupId] = useState('');

    useEffect(() => {
        const result = getGroupAndId(ms.level1, ms.index1, ms.detailGroups);
        let localLevel1 = { ...ms.level1 };
        setLevel1(ms.level1);
        setIndex1(ms.index1);
        setKey(result.key);
        const mitionalGroupButtons = ms.detailInfo.groupButtons
            ? Object.keys(ms.detailInfo.groupButtons).length
            : 0;
        const mitionalButtons = ms.detailInfo.buttons ? Object.keys(ms.detailInfo.buttons).length : 0;
        setButtonsGroupCount(result.buttonsGroupCount + mitionalGroupButtons);
        setButtonsCount(result.buttonsCount + mitionalButtons);
        // setButtonsGroupCount(result.buttonsGroupCount);
        // setButtonsCount(result.buttonsCount);
        setGroup(result.group);
        setGroupId(result.groupId ? result.groupId : '');
        EventsManager.on('previewFeature', () => {
            const feature = ActionsController.detailFeatures[ms.index1];
            let m = false;
            if (feature) {
                const result = getGroupAndId(feature, ms.index1, ms.detailGroups);
                if (feature && (feature.loading != localLevel1?.loading || feature.loading == undefined)) {
                    m = true;
                }
                if (
                    feature.mGroupId != localLevel1.mGroupId ||
                    feature.operationalmId != localLevel1.operationalmId ||
                    feature.mId != localLevel1.mId ||
                    result.groupId != groupId
                ) {
                    setKey(result.key);
                    const mitionalGroupButtons = ms.detailInfo.groupButtons
                        ? Object.keys(ms.detailInfo.groupButtons).length
                        : 0;
                    const mitionalButtons = ms.detailInfo.buttons
                        ? Object.keys(ms.detailInfo.buttons).length
                        : 0;
                    setButtonsGroupCount(result.buttonsGroupCount + mitionalGroupButtons);
                    setButtonsCount(result.buttonsCount + mitionalButtons);
                    setGroup(result.group);
                    setGroupId(result.groupId ? result.groupId : '');
                    m = true;
                }
                if (feature.features && !m) {
                    if (feature.features.length != localLevel1.features.length) {
                        m = true;
                    }
                    if (!m) {
                        const objectKeys = feature.features.m((x) => x.attributes['objectid']);
                        const objectKeysLocal = localLevel1.features.m((x) => x.attributes['objectid']);
                        const allFounded = objectKeysLocal.every((ai) => objectKeys.includes(ai));
                        if (!allFounded) {
                            m = true;
                        }
                    }
                }
                if (m) {
                    localLevel1 = feature;
                    setLevel1({ ...feature });
                }
            }
        });
        return () => {
            log('CUSTOM_POPUP UNMOUNTED ROW');
        };
    }, []);

    const getGroupAndId = (level1: IDetailData, key: number, groups: { [key: string]: IDetailsGroupInfo }) => {
        let group = {} as IDetailsGroupInfo;
        let groupId = undefined as string | undefined;
        let buttonsCount = 0;
        let buttonsGroupCount = 0;
        const localKey = level1.operationalmId + level1.mId + key;
        Object.keys(groups).m((x) => {
            if (!groupId)
                if (groups[x].mGroupId == level1.mGroupId) {
                    if (groups[x].operationalmId) {
                        if (groups[x].operationalmId == level1.operationalmId) {
                            if (groups[x].mId || groups[x].mId == '0') {
                                if (groups[x].mId == level1.mId) {
                                    group = ms.detailInfo.groups[x];
                                    groupId = x;
                                }
                            } else {
                                group = ms.detailInfo.groups[x];
                                groupId = x;
                            }
                        }
                    } else {
                        group = ms.detailInfo.groups[x];
                        groupId = x;
                    }
                }
        });
        if (Object.keys(group).length == 0) {
            if (
                appConfig.data.mGroups[level1.mGroupId] &&
                appConfig.data.mGroups[level1.mGroupId].operationalms &&
                (appConfig.data.mGroups[level1.mGroupId].operationalms as IConfigOperationalm)[
                    level1.operationalmId
                ] &&
                (appConfig.data.mGroups[level1.mGroupId].operationalms as IConfigOperationalm)[
                    level1.operationalmId
                ].ms &&
                (
                    (appConfig.data.mGroups[level1.mGroupId].operationalms as IConfigOperationalm)[
                        level1.operationalmId
                    ].ms as IConfigm
                )[level1.mId]
            ) {
                const localmGroup = (
                    (appConfig.data.mGroups[level1.mGroupId].operationalms as IConfigOperationalm)[
                        level1.operationalmId
                    ].ms as IConfigm
                )[level1.mId];
                if (localmGroup) {
                    group = {
                        mGroupId: level1.mGroupId,
                        operationalmId: level1.operationalmId,
                        mId: level1.mId,
                        formatString: localmGroup.formatString as string,
                        title: localmGroup.title ? localmGroup.title : '',
                        fields: localmGroup.fields as IDetailsGroupFields,
                        buttons: {},
                        groupButtons: {},
                    };
                }
            }
        }
        if (Object.keys(group).length > 0) {
            if (group.buttons) buttonsCount = Object.keys(group.buttons).length;
            if (group.groupButtons) buttonsGroupCount = Object.keys(group.groupButtons).length;
        }
        return {
            group: group,
            groupId: groupId,
            buttonsCount: buttonsCount,
            buttonsGroupCount: buttonsGroupCount,
            key: localKey,
        };
    };

    return ((!level1.loading && level1.features && level1.features.length > 0) || level1.loading) && group.title ? (
        <Accordion
            expanded={expanded}
            onm={(event, expanded) => {
                setExpanded(expanded);
            }}
            style={{}}
            key={key}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="farmers-filters-content"
                id="farmers-filters-header"
                disabled={level1.loading}
                classm={classes.expansionPanelSummaryLevel1 + ' accordion-sum'}
                style={{ minHeight: 40 }}
            >
                {level1.loading ? (
                    <marProgress
                        style={{
                            width: '100%',
                            height: '2px',
                            position: 'absolute',
                            top: '0',
                            color: '#004990',
                            marginLeft: '-15px',
                        }}
                    />
                ) : null}
                <div
                    style={{
                        float: 'left',
                        width: `calc(100% - ${buttonsGroupCount ? buttonsGroupCount * 35 : 0}px)`,
                        pmingTop: '5px',
                    }}
                >
                    {level1.features ? (
                        <Typography
                            classm={classes.heading}
                        >{`${group.title} - ${level1.features.length} бр.`}</Typography>
                    ) : (
                        <Typography classm={classes.heading}>{`${group.title}`}</Typography>
                    )}
                </div>
                {level1.features && ms.detailInfo.groupButtons
                    ? Object.keys(ms.detailInfo.groupButtons).m((button, index) => {
                          return (
                              <RenderIconGroupButtonAll
                                  key={'icon_button_' + index}
                                  controllerKey={button}
                                  parent={group}
                                  detailData={level1}
                                  button={ms.detailInfo.groupButtons[button]}
                              />
                          );
                      })
                    : null}
                {level1.features && group.groupButtons
                    ? Object.keys(group.groupButtons).m((button, index) => {
                          return (
                              <RenderIconGroupButton
                                  key={'icon_button_' + index}
                                  controllerKey={button}
                                  parent={group}
                                  detailData={level1}
                                  button={group.groupButtons[button]}
                                  groupKey={groupId}
                              />
                          );
                      })
                    : null}
            </AccordionSummary>
            <AccordionDetails style={{ pming: 5, height: '100%' }}>
                {expanded ? (
                    <>
                        <Grid container>
                            {level1 && !level1.loading && level1.features
                                ? level1.features.m((level2: IDetailDataAttributes | Graphic, index2: number) => {
                                      return (
                                          <Grid m xs={12} key={`${group.title} ${index1} ${index2}`}>
                                              <RenderSubaccordion
                                                  level2={level2}
                                                  index2={index2}
                                                  buttonsCount={buttonsCount}
                                                  buttons={ms.detailInfo.buttons}
                                                  group={group}
                                                  groupId={groupId}
                                                  level1={level1}
                                              />
                                          </Grid>
                                      );
                                  })
                                : ''}
                        </Grid>
                    </>
                ) : null}
            </AccordionDetails>
        </Accordion>
    ) : null;
};

export default RenderAccordion;
