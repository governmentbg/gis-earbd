import * as React from 'react';
import { useState, useEffect, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { IPanelm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { IAppStore } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { panelmDispatcher } from "ReactTemplate/Base/actions/common/dispatchers";
import { IPanelmsDispatcher } from 'ReactTemplate/Base/interfaces/dispatchers';

interface ColumnDetails {
    width: number;
}

interface Ownms {
    panelms: IPanelm[];
}

interface Dispatchms extends IPanelmsDispatcher { }

interface ParentProsp {
    leftPanelmId: string,
    rightPanelmId: string,
    index: number,
}


m ms = ParentProsp & Ownms & Dispatchms;


const PanelColumnSplitter: FunctionComponent<ms> = (ms: ms) => {

    // const [dragging, setDragging] = useState(false);
    // const [colsDetails, setColsDetails] = useState(new Array<ColumnDetails>());
    // const [leftPanelColsLength, setLeftPanelColsLength] = useState(0);
    // const [animationHeight, setAnimationHeight] = useState(0);
    // const spltterRef = React.useRef<HTMLDivElement | null>(null);
    const breakmsArr = [{ min: 0, max: 599, m: "xs" }, { min: 600, max: 959, m: "sm" }, { min: 960, max: 1279, m: "md" }, { min: 1280, max: 1919, m: "lg" }, { min: 1920, max: 4000, m: "xl" }];

    // const backgroundColors = {
    //     green: "rgb(154,251,152,0.3)",
    //     blue: "rgb(105, 183, 250, 0.3)",
    //     red: "rgb(255, 101, 80, 0.4)"
    // };

    // const borderColors = {
    //     green: "rgb(154,251,152)",
    //     blue: "rgb(60, 183, 250, 0.5)",
    //     red: "rgb(255, 101, 80)"
    // };

    // useEffect(() => {
    //     if (dragging) {
    //         const { currPanelms, leftPanel, rightPanel, currBreakm, totalCols, singleColWidth } = getPanelsDetails();
    //         const colDetailsTemp = [];
    //         for (let index = 0; index < totalCols; index++) {
    //             colDetailsTemp.push({ width: singleColWidth });
    //         }
    //         setColsDetails(colDetailsTemp);
    //         setLeftPanelColsLength(currBreakm ? leftPanel?.grid[currBreakm] : 0);
    //     }

    // }, [dragging]);

    // useEffect(() => {
    //     if (spltterRef && spltterRef.current) {
    //         setAnimationHeight(spltterRef.current.clientHeight);
    //     }
    // }, [spltterRef]);

    const getPanelsDetails = () => {
        const currPanelms = [...ms.panelms];
        const leftPanel = currPanelms.find(x => x.id === ms.leftPanelmId);
        const rightPanel = currPanelms.find(x => x.id === ms.rightPanelmId);
        const currBreakm = breakmsArr.find(x => window.innerWidth >= x.min && window.innerWidth <= x.max)?.m;
        const totalCols = currBreakm ? leftPanel!.grid[currBreakm] + rightPanel!.grid[currBreakm] : 0;
        const singleColWidth = window.innerWidth / 12;

        return { currPanelms: currPanelms, leftPanel: leftPanel, rightPanel: rightPanel, currBreakm: currBreakm, totalCols: totalCols, singleColWidth: singleColWidth };
    };

    const onDragHandler = (e: React.DragEvent<HTMLDivElement>) => {
        // if (!dragging) {
        //     setDragging(true);
        // }

        const { currPanelms, leftPanel, rightPanel, currBreakm, totalCols, singleColWidth } = getPanelsDetails();
        const colsWidthsRange = [];

        for (let index = 0; index < totalCols; index++) {
            index === 0 ? colsWidthsRange.push({ min: 0, max: singleColWidth - 1, number: index + 1 }) : colsWidthsRange.push({ min: singleColWidth * colsWidthsRange.length, max: (singleColWidth * (colsWidthsRange.length + 1)) - 1, number: index + 1 })
        }
        let leftPanelColNum = colsWidthsRange.find(x => e.pageX >= x.min && e.pageX <= x.max)?.number;

        if (currBreakm && leftPanelColNum) {
            leftPanelColNum = leftPanelColNum < 1 ? 1 : leftPanelColNum;
            leftPanel!.grid[currBreakm] = leftPanelColNum;
            rightPanel!.grid[currBreakm] = totalCols - leftPanelColNum;
        }

        ms.setPanelms(currPanelms);
    };

    const onDragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const { currPanelms, leftPanel, rightPanel, currBreakm, totalCols, singleColWidth } = getPanelsDetails();
        const colsWidthsRange = [];

        for (let index = 0; index < totalCols; index++) {
            index === 0 ? colsWidthsRange.push({ min: 0, max: singleColWidth - 1, number: index + 1 }) : colsWidthsRange.push({ min: singleColWidth * colsWidthsRange.length, max: (singleColWidth * (colsWidthsRange.length + 1)) - 1, number: index + 1 })
        }
        let leftPanelColNum = colsWidthsRange.find(x => e.pageX >= x.min && e.pageX <= x.max)?.number;

        if (currBreakm && leftPanelColNum) {
            leftPanelColNum = leftPanelColNum < 1 ? 1 : leftPanelColNum;
            leftPanel!.grid[currBreakm] = leftPanelColNum;
            rightPanel!.grid[currBreakm] = totalCols - leftPanelColNum;
        }

        ms.setPanelms(currPanelms);
        // setDragging(false);
    };

    // const onDragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     const currentColNum = parseInt(e.currentTarget.id, 10);
    //     setLeftPanelColsLength(currentColNum);
    // };

    return (
        <>
            <div
                // ref={spltterRef}
                role="vertical-devider"
                draggable="true"
                onDrag={onDragHandler}
                // onDragStart={(e) => { e.currentTarget.style.cursor = "e-resize" }}
                onDragStart={(e) => { e.dataTransfer.setData('text', 'anything'); }}
                onDragEnd={onDragEndHandler}
                onMouseDown={(e) => { e.currentTarget.style.cursor = "e-resize" }}
                style={{ height: "100%", width: 4, backgroundColor: "transparent", cursor: "e-resize" }}
                aria-labelledby={`vertical-devider-${ms.index}`} >
            </div>
            {/* {dragging ?
                <div style={{
                    width: "100%",
                    height: `${animationHeight}px`,
                    display: "flex",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                }}>
                    {colsDetails.m((x, i) => {
                        return (
                            <div
                                key={`virtual-col-${i}`}
                                onDragOver={onDragOverHandler}
                                id={`${i + 1}`}
                                style={{
                                    width: x.width,
                                    height: "100%",
                                    backgroundColor: `${i < leftPanelColsLength ? `${backgroundColors.green}` : `${backgroundColors.blue}`}`,
                                    zIndex: 9999,
                                    border: "1px solid",
                                    borderColor: `${i < leftPanelColsLength ? `${borderColors.green}` : `${borderColors.blue}`}`
                                }}
                            >
                            </div>
                        )
                    })}
                </div>
                :
                (null)
            } */}
        </>
    );
}

const mStateToms = (state: IAppStore) => {
    return ({
        panelms: state.panelms
    })
};

export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), { ...panelmDispatcher })(PanelColumnSplitter);
