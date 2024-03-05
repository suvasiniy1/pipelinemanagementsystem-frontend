
// @flow
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Stage } from "../../../models/stage";
import { DealHeader } from "./dealHeader";
import { DealStage } from "./dealStage";

type params = {
    isCombineEnabled?: any,
    initial?: any,
    useClone?: any,
    containerHeight?: any,
    withScrollableColumns?: any,
    rowData?: Array<Stage>;
    onSaveChanges?: any;

}

export const Deals = (props: params) => {

    const [stages, setStages] = useState<Array<Stage>>([]);
    const [isLoading, setIsLoading]=useState(false);

    useEffect(() => {
        let stages: Array<Stage> = JSON.parse(localStorage.getItem("stagesList") as any) ?? [];
        stages.forEach((s, index) => {
            s.deals.forEach((d, dIndex) => {
                d.id = `G${index + dIndex}`;
            })
        })
        setStages(stages);
    }, [])

    const updateRowData = () => {

        setStages(JSON.parse(localStorage.getItem("stagesList") as any) ?? []);
    }

    const reorderQuoteMap = (quoteMap: Array<Stage>, source: any, destination: any) => {

        const sourceIndex = quoteMap.findIndex(q => q.name == source.droppableId);
        const destinationIndex = quoteMap.findIndex(q => q.name == destination.droppableId);
        const orderIndex = destination.index;

        let item = quoteMap[sourceIndex].deals[source.index];
        item.pipeLineId = quoteMap[sourceIndex].id;
        quoteMap[sourceIndex].deals.splice(source.index, 1);
        quoteMap[destinationIndex].deals.splice(orderIndex, 0, item);

        return quoteMap;

    };

    const onDragEnd = (result: any) => {
        debugger
        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const data = reorderQuoteMap(
            stages,
            source,
            destination
        ) as any;

        debugger
        localStorage.setItem("stagesList", JSON.stringify([...data]));
        setIsLoading(true);
        setStages([...data]);
        setTimeout(() => {
            setIsLoading(false);
        }, 10);


    };

    return (
        <>
            {isLoading ? null : <div hidden={stages.length == 0}>
                <DealHeader canAddDeal={stages.length > 0} onSaveChanges={(e: any) => updateRowData()} />
                <div className="pdstage-area">
                    <div className="container-fluid">
                        <div className="pdstage-row">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable
                                    droppableId="board"
                                    type="COLUMN"
                                    direction="horizontal"
                                >
                                    {(provided) => (
                                        <>
                                            {stages?.map((item, index) => (
                                                <DealStage
                                                    key={index}
                                                    index={item}
                                                    title={item.name}
                                                    quotes={item.deals}
                                                    onSaveChanges={(e: any) => props.onSaveChanges()}
                                                />
                                            )
                                            )}
                                            {provided.placeholder}
                                        </>
                                    )}
                                </Droppable>

                            </DragDropContext>


                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
};
