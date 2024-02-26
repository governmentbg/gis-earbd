import * as React from 'react';
import { useState, useEffect, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { IPanelm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { IAppStore } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { panelmDispatcher } from "ReactTemplate/Base/actions/common/dispatchers";
import { IPanelmsDispatcher } from 'ReactTemplate/Base/interfaces/dispatchers';


interface Ownms {
    panelms: IPanelm[];
}

interface Dispatchms extends IPanelmsDispatcher { }

interface ParentProsp {
    upperPanelmId: string;
    lowerPanelmId: string;
    index: number;
    parentHeight: number;
    parentPanleId: string;
}


m ms = ParentProsp & Ownms & Dispatchms;


const PanelRowSplitter: FunctionComponent<ms> = (ms: ms) => {

    const calculateSiblingPanelsHeight = () => {
        const currPanelms = [...ms.panelms];
        const parentPanel = currPanelms.find(x => x.id === ms.parentPanleId);
        let sumHeight = 0;

        if (parentPanel && parentPanel.children) {
            const siblings = parentPanel.children.filter(x => x.id !== ms.upperPanelmId).filter(y => y.id !== ms.lowerPanelmId);
            siblings.forEach(x => sumHeight += parseInt(x.height.substr(0, x.height.length - 1), 10));
        }

        return (sumHeight);
    };

    const [initialY, setInitialY] = useState(0);
    const [previousY, setPreviousY] = useState(0);
    const [previousUpperPanelHeight, setPreviousUpperPanelHeight] = useState(0);


    const getPanelsDetails = () => {
        const currPanelms = [...ms.panelms];
        const parentPanel = currPanelms.find(x => x.id === ms.parentPanleId);
        const upperPanel = parentPanel && parentPanel.children ? parentPanel.children.find(x => x.id === ms.upperPanelmId) : null;
        const lowerPanel = parentPanel && parentPanel.children ? parentPanel.children.find(x => x.id === ms.lowerPanelmId) : null;

        return { currPanelms: currPanelms, parentPanel: parentPanel, upperPanel: upperPanel, lowerPanel: lowerPanel };
    };

    const onDragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const { upperPanel } = getPanelsDetails();
        const initialUpperPanelHeight = upperPanel ? parseInt(upperPanel?.height.substr(0, upperPanel?.height.length - 1), 10) : 0;
        setPreviousUpperPanelHeight(initialUpperPanelHeight);
        // setInitialY(e.pageY);
        setPreviousY(e.pageY);
    };

    // const onDragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    //     const siblingPanlesHeight = calculateSiblingPanelsHeight();
    //     // const currPanelms = [...ms.panelms];
    //     // const parentPanel = currPanelms.find(x => x.id === ms.parentPanleId);
    //     // const upperPanel = parentPanel && parentPanel.children ? parentPanel.children.find(x => x.id === ms.upperPanelmId) : null;
    //     // const lowerPanel = parentPanel && parentPanel.children ? parentPanel.children.find(x => x.id === ms.lowerPanelmId) : null;
    //     const { currPanelms, parentPanel, upperPanel, lowerPanel } = getPanelsDetails();
    //     // const initialUpperPanelHeight = upperPanel ? parseInt(upperPanel?.height.substr(0, upperPanel?.height.length - 1), 10) : 0;
    //     // const initialLowerPanelHeight = lowerPanel ? parseInt(lowerPanel?.height.substr(0, lowerPanel?.height.length - 1), 10) : 0;
    //     const movementYinPercentage = (Math.abs(previousY - e.pageY) / ms.parentHeight) * 100;
    //     log(movementYinPercentage);
    //     let afterDragUpperPanelHeight = 0;
    //     // move down
    //     if (e.pageY > previousY) {
    //         afterDragUpperPanelHeight = previousUpperPanelHeight + movementYinPercentage;
    //     }
    //     else if (e.pageY < previousY) { // move up
    //         afterDragUpperPanelHeight = previousUpperPanelHeight - movementYinPercentage;
    //     }

    //     if (upperPanel && lowerPanel) {
    //         afterDragUpperPanelHeight = afterDragUpperPanelHeight < 15 ? 15 : afterDragUpperPanelHeight;
    //         afterDragUpperPanelHeight = afterDragUpperPanelHeight > 85 ? 85 : afterDragUpperPanelHeight;
    //         upperPanel.height = `${afterDragUpperPanelHeight}%`;
    //         // lowerPanel.height = `${initialTotalHeightInPercentage - afterDragUpperPanelHeight}%`;
    //         lowerPanel.height = `${(100 - siblingPanlesHeight) - afterDragUpperPanelHeight}%`;
    //         log(upperPanel.height);
    //         log(lowerPanel.height);
    //     }

    //     setPreviousUpperPanelHeight(afterDragUpperPanelHeight);
    //     ms.setPanelms(currPanelms);
    // };


    const onDragHandler = (e: React.DragEvent<HTMLDivElement>) => {
        // e.dataTransfer.setData("text", e.target.id);
        if (previousUpperPanelHeight) {
            log(previousUpperPanelHeight)
            const siblingPanlesHeight = calculateSiblingPanelsHeight();
            const { currPanelms, parentPanel, upperPanel, lowerPanel } = getPanelsDetails();
            const movementYinPercentage = (Math.abs(previousY - e.pageY) / ms.parentHeight) * 100;
            log(movementYinPercentage);
            let afterDragUpperPanelHeight = 0;
            if (movementYinPercentage >= 2) {
                // move down
                if (e.pageY >= previousY) {
                    afterDragUpperPanelHeight = previousUpperPanelHeight + movementYinPercentage;
                }
                else if (e.pageY < previousY) { // move up
                    afterDragUpperPanelHeight = previousUpperPanelHeight - movementYinPercentage;
                }

                if (upperPanel && lowerPanel) {
                    afterDragUpperPanelHeight = afterDragUpperPanelHeight < 15 ? 15 : afterDragUpperPanelHeight;
                    afterDragUpperPanelHeight = afterDragUpperPanelHeight > 85 ? 85 : afterDragUpperPanelHeight;
                    upperPanel.height = `${afterDragUpperPanelHeight}%`;
                    lowerPanel.height = `${(100 - siblingPanlesHeight) - afterDragUpperPanelHeight}%`;
                    log(upperPanel.height);
                    log(lowerPanel.height);
                }

                setPreviousY(e.pageY);
                setPreviousUpperPanelHeight(afterDragUpperPanelHeight);
                ms.setPanelms(currPanelms);
            }
        }
    };

    return (
        <div
            role="horizontal-devider"
            draggable="true"
            onDrag={onDragHandler}
            onDragStart={onDragStartHandler}
            // onDragEnd={onDragEndHandler}
            style={{ width: "100%", height: 4, backgroundColor: "transparent", cursor: "s-resize" }}
            aria-labelledby={`horizontal-devider-${ms.index}`} >
        </div>
    );
}

const mStateToms = (state: IAppStore) => {
    return ({
        panelms: state.panelms
    })
};

export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), { ...panelmDispatcher })(PanelRowSplitter);
