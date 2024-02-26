import * as React from 'react';
import { useState, useEffect, FunctionComponent } from 'react';
import { IPanelm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';


interface ImsTabPanel {
	panelm: IPanelm,
	children: JSX.Element,
	index: string,
	value: string,
}


const TabPanel: FunctionComponent<ImsTabPanel> = (ms: ImsTabPanel) => {
	const [isHidden, setIsHidden] = useState(true);
	const { children, value, index } = ms;

	useEffect(() => {
		if (ms.panelm.ms.find(x => x.id === value)) {
			// log(isHidden);
			if (value === index) { // sets the visability of the selected tab to True
				setIsHidden(false);
			}

			if (value !== index) { // hides all the tabs from the group of the selected tab
				setIsHidden(true);
			}
		}

	}, [value]);

	return (
		<div
			role="tabpanel"
			style={{ overflow: 'auto', position: "relative", height: "calc(100% - 15px)" }}
			hidden={isHidden}
			id={`nav-tabpanel-${index}`}
			aria-labelledby={`nav-tab-${index}`} >
			{children}
		</div>
	);
}

export default TabPanel;
