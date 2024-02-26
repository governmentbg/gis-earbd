import * as React from 'react';
import { useEffect } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { IAppConfig, IPanelm } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import { IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import TabPanel from '../../../../../Lib/v0.6/src/Base/components/TabPanel';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper'
import { Panel } from './Panels';
import { CustomTooltip } from '../../../../../Lib/v0.6/src/Base/components/Widgets/CustomMaterialTooltip';
import Fade from '@material-ui/core/Fade';
import { openTab } from '../../../../../Lib/v0.6/src/ActionsController/Actions'
const DIRECTIONRIGHT = "right";

interface ImsTabComponent {
	panelm: IPanelm,
	index: string,
	groupIndex: string | undefined,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: string, groupIndex?: string) => void,
	// getPanelm: Function,
	// getPanelm: JSX.Element,
	configmGroups: any,
	appConfig: IAppConfig;
	// selectedTab: string;
	// setSelectedTab: (id: string) => void;
	ism: (panelm: IPanelm) => boolean;
	userInfo: IUserInfo;
	parentHeight: number;
}

const TabComponent: React.FunctionComponent<ImsTabComponent> = (ms: ImsTabComponent) => {
	// const [selectedPanel, setSelectedPanel] = React.useState(ms.selectedTab);
	const [selectedPanel, setSelectedPanel] = React.useState(Object.keys(ms.panelm.ms).find(x =>
		ms.panelm.ms[x].selected && ms.panelm.ms[x].render) || Object.keys(ms.panelm.ms)[0]);
	const handleTabm = (value: string) => {
		openTab(value)
		//setSelectedPanel(value);

		// ms.setSelectedTab(value);
	}

	useEffect(() => {
		const selectedTab = Object.keys(ms.panelm.ms).find(x => ms.panelm.ms[x].selected && ms.panelm.ms[x].render)
		if (selectedTab) {
			setSelectedPanel(selectedTab);
		}
	}, [ms.panelm]);

	// const getSelectedPanel = () => {
	// 	const msTab = Object.keys(ms.panelm.ms).find(x => ms.panelm.ms[x].selected && ms.panelm.ms[x].render)
	// 	var result = selectedPanel;
	// 	if (msTab && msTab != selectedPanel) {
	// 		result = msTab;
	// 		setSelectedPanel(msTab);
	// 	}
	// 	return result;
	// }
	// useEffect(() => {
	// 	if (!selectedPanel) {
	// 		var mSelected = ms.panelm.ms.find(x => x.default)
	// 		if (mSelected) {
	// 			setSelectedPanel(mSelected.id);
	// 		} else {
	// 			setSelectedPanel(ms.panelm.ms[0].id);
	// 		}
	// 	}
	// }, []);

	// useEffect(() => {
	// 	if (ms.selectedTab) {
	// 		if (ms.panelm.ms.find(x => x.id === ms.selectedTab)) {
	// 			setSelectedPanel(ms.selectedTab);
	// 		}
	// 	}
	// 	// else {
	// 	// 	setSelectedPanel(ms.panelm.ms[0].id);
	// 	// }
	// }, [ms.selectedTab]);
	const getSelectedPanel = (selectedPanel:string, panel:IPanelm) => {
		var result = selectedPanel;
		var newResult = "";
		var backUpResult = "";
		Object.keys(panel.ms).m((key, index) => {
			var x = ms.panelm.ms[key];
			if( x.render && key == selectedPanel) {
				newResult = selectedPanel;
			}
			if(!backUpResult&&x.render){
				backUpResult = key
			}
		})
		if(newResult != result) {
			result = backUpResult;
		}
		return result;
	}

	return (
		<div style={{ height: 'calc(100% - 40px)', position:"absolute", 
			top: 0,
			left: 0,
			right: 0,
			bottom: 0 }}>
			<Tabs
				classm={"smallScroll"}
				variant="scrollable"
				scrollButtons="auto"
				value={getSelectedPanel(selectedPanel, ms.panelm)}
				TabIndicatorms={{ style: { background: "black", minWidth: 0, display: "none" } }}
				style={{
					minHeight: "45px",
					maxHeight: "60px",
					position: "relative",
					overflow: "auto", width: "100%"
				}}
				onm={(e, n) => { handleTabm(n) }}>
				
				{Object.keys(ms.panelm.ms).m((key, index) => {
					var x = ms.panelm.ms[key];
					return x.render ?
						<Tab value={key} style={
							{
								// fontWeight: 'bold',
								// fontSize: '14px',
								//minHeight: '25px',
								maxWidth: '100%',
								height: '27px',
								textTransform: 'none',
								outm: "none",
								minWidth: 0,
								pmingLeft: "5px",
								pmingRight: "5px",
							}
						}
							key={'tabs-header-' + index}
							label={x.iconUrl ? undefined : x.title}
							icon={x.iconUrl ?
								<CustomTooltip arrow
									enterDelay={500}
									leaveDelay={100}
									TransitionComponent={Fade}
									placement="bottom"
									title={x.title || ""}>
									<img style={{ pmingLeft: "10px", height: "25px", pmingRight: "10px" }} src={UrlHelper.getUrlPath(x.iconUrl, window.configUrl)} />
								</CustomTooltip>
								:
								undefined
							}
						/>
						:
						(null)
				})}
			</Tabs>

			{Object.keys(ms.panelm.ms).m((key, index) => {
				var x = ms.panelm.ms[key];
				return <TabPanel key={'tabs-content-' + index}
					value={selectedPanel}
					index={key}
					panelm={ms.panelm} >
					<Panel
						panelm={x as any as IPanelm}
						index={key}
						configmGroups={ms.configmGroups}
						appConfig={ms.appConfig}
						groupIndex={ms.groupIndex}
						// setSelectedTab={ms.setSelectedTab}
						// selectedTab={ms.selectedTab}
						togglePanel={ms.togglePanel}
						ism={ms.ism}
						// ism={}
						userInfo={ms.userInfo}
						parentHeight={ms.parentHeight}
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
