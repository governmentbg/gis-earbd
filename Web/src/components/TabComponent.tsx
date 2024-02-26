import * as React from 'react';
import { useEffect } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { IAppConfig, IPanelm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import TabPanel from './TabPanel';
import TabButtons from './TabButtons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import UrlHelper from 'ReactTemplate/Base/helpers/UrlHelper'
import {Panel} from '../App';
import UserHelper from './UserHelper'

const DIRECTIONRIGHT = "right";

interface ImsTabComponent {
	panelm: IPanelm,
	index: number,
	groupIndex: number | undefined,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, groupIndex?: number) => void,
	// getPanelm: Function,
	// getPanelm: JSX.Element,
	configmGroups: any,
	appConfig: IAppConfig;
	selectedTab: string;
	setSelectedTab: (id: string) => void;
	ism: (panelm: IPanelm) => boolean;
	userInfo:IUserInfo;
	sidePanel:boolean
}

const TabComponent: React.FunctionComponent<ImsTabComponent> = (ms: ImsTabComponent) => {
	const [selectedPanel, setSelectedPanel] = React.useState(ms.selectedTab);
	const handleTabm = (value: string) => {
		setSelectedPanel(value);
		ms.setSelectedTab(value);
	}

	useEffect(() => {
		if (!selectedPanel) {
			var mSelected = ms.panelm.ms.find(x => x.default)
			if (mSelected) {
				setSelectedPanel(mSelected.id);
			} else {
				setSelectedPanel(ms.panelm.ms[0].id);
			}
		}
	}, []);

	useEffect(() => {
		if (ms.selectedTab) {
			if (ms.panelm.ms.find(x => x.id === ms.selectedTab)) {
				setSelectedPanel(ms.selectedTab);
			}
		}
		// else {
		// 	setSelectedPanel(ms.panelm.ms[0].id);
		// }
	}, [ms.selectedTab]);
	const bigTabs = (panelms:IPanelm) => {
		var result = false
		panelms.ms.forEach(x=>{
			if(x.iconUrl&&x.title)	{
				result=true;
			}
		})
		return result;
	}
	return (
		<div style={bigTabs(ms.panelm)? { height: 'calc(100% - 57px)' } : { height: 'calc(100% - 27px)' }}>
			<Tabs
				classm={"smallScroll"}
				variant="scrollable"
				scrollButtons="auto"
				value={selectedPanel ? ms.panelm.ms.find(x => x.id === selectedPanel) && 
					ms.panelm.ms.find(x => x.id === selectedPanel)?.render ? selectedPanel : 
					ms.panelm.ms[0].id : ms.panelm.ms[0].id}
				TabIndicatorms={{ style: { background: "black", minWidth: 0, display: "none" } }}
				style={{
					minHeight: "45px",
					position: "relative",
					overflowY: "hidden",
					overflow: "auto", width: "100%"
				}}
				onm={(e, n) => { handleTabm(n) }}>

				{ms.panelm.ms.m((x, index) => {
					return x.render ? <Tab value={x.id} style={
						{
							// fontWeight: 'bold',
							// fontSize: '14px',
							//minHeight: '25px',
							height: '27px',
							textTransform: 'none',
							outm: "none",
							minWidth: 0,
							pmingLeft: "5px",
							pmingRight: "5px",
						}
					}
						key={'tabs-header-' + index} 
						label={x.title} 
						icon={x.iconUrl?
							<img style={{pmingLeft: "10px", height: "25px", pmingRight: "10px"}} title={x.title} src={UrlHelper.getUrlPath(x.iconUrl, window.configUrl)}/>
							:
							undefined} 
						/>
						:
						(null)
				})}
			</Tabs>
			{ms.panelm.ms.m((x, index) => {
					return <TabPanel key={'tabs-content-' + index} value={selectedPanel} index={x.id} panelm={ms.panelm} >
						<Panel 
							panelm={(x as any) as IPanelm} 
							index={index} 
							configmGroups={ms.configmGroups} 
							appConfig={ms.appConfig} 
							groupIndex={ms.groupIndex} 
							setSelectedTab={ms.setSelectedTab} 
							selectedTab={ms.selectedTab} 
							togglePanel={ms.togglePanel}
							ism={ms.ism}
							// ism={}
						/>
						{/* {ms.getPanelm} */}
						{/* {React.cloneElement(ms.getPanelm, {panelm: x as IPanelm, index, configmGroups: ms.configmGroups, appConfig: ms.appConfig, groupIndex: ms.groupIndex, setSelectedTab: ms.setSelectedTab, selectedTab: ms.selectedTab})} */}
						{/* {ms.getPanelm(x as IPanelm, index, ms.configmGroups, ms.appConfig, ms.groupIndex, ms.setSelectedTab, ms.selectedTab)} */}
					</TabPanel>
			})
		}
		</div>
	);
}

export default TabComponent;
