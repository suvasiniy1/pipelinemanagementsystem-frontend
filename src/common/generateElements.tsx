import SelectDropdown from "../elements/SelectDropdown";
import Slider from "../elements/Slider";
import TextArea from "../elements/TextArea";
import TextBox from "../elements/TextBox";
import { CustomActionPosition, IControl } from "../models/iControl";


type props = {
    controlsList: Array<any>,
    selectedItem: any,
    onChange?: any,
    checked?: any,
    getListofItemsForDropdown?: (item: any) => {},
    disable?: boolean,
}
const GenerateElements: React.FC<props> = (props) => {

    const { controlsList, selectedItem, onChange, checked, getListofItemsForDropdown, disable, ...others } = props;

    const getElement = (item: any) => {
        
        switch (item.type) {
            case "textarea":
                return <TextArea item={item} selectedItem={selectedItem} disable={disable} />
            case "slider":
                return <Slider item={item} selectedItem={selectedItem} onChange={(e: any) => onChange && onChange(e, item)} checked={checked} />
            case "dropdown":
                return <SelectDropdown item={item} selectedItem={selectedItem} disable={disable} list={getListofItemsForDropdown && getListofItemsForDropdown(item) as any} onItemChange={(e: any) => onChange(e, item)} />
            default:
                return <TextBox item={item} selectedItem={selectedItem} disable={disable} onChange={(e: any) => { onChange && onChange(e, item) }} />
        }
    }

    const customActionElement = (item: IControl) => {
        return (
            <>
                {
                    item.customAction == CustomActionPosition.Right ?
                        <div className={item.actionName + ' text-end'}><a href="#">{item.actionName}</a></div>
                        : item.customAction == CustomActionPosition.Left ? <div className={item.actionName}><a href="#">{item.actionName}</a></div> : null
                }
            </>
        )
    }

    return (
        <>
            {
                controlsList.map((item: IControl, index: number) => (
                    item.isControlInNewLine ?
                        <div key={index}>
                            {
                                !item.dependentChildren && !item.isDependentChildren ?
                                    <div>
                                        <div className="form-group row" hidden={item.hidden}>
                                            <label htmlFor="name" id={`labelFor_${item.value}`} className={`col-sm-${item.labelSize ? item.labelSize : 4} col-form-label ${item.isRequired ? "required" : ""}`}>{item.key}:</label>
                                        </div>
                                        <div className="form-group row">
                                            <div className={`col-sm-${item.elementSize ? item.elementSize : 6} errmessage`}>
                                                {
                                                    getElement(item)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    !item.isDependentChildren ?
                                        <div className="form-group row">
                                            <label htmlFor="name" id={`labelFor_${item.value}`} className={`col-sm-${item.labelSize ? item.labelSize : null} col-form-label ${item.isRequired ? "required" : ""}`}>{item.key}:</label>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    {
                                                        getElement(item)
                                                    }
                                                    {
                                                        customActionElement(item)
                                                    }
                                                </div>
                                                <div className='col-md-6'>
                                                    {
                                                        getElement(controlsList.find(c => c.key === item.dependentChildren))

                                                    }
                                                    {
                                                        customActionElement(controlsList.find(c => c.key === item.dependentChildren))
                                                    }
                                                </div>
                                            </div>
                                        </div> : null
                            }


                        </div> :
                        <div className="form-group row" key={index} hidden={item.hidden}>
                            <label htmlFor="name" id={`labelFor_${item.value}`} className={`col-sm-${item.labelSize ? item.labelSize : 4} col-form-label ${item.isRequired ? "required" : ""}`}>{item.key}:</label>
                            <div className={`col-sm-${item.elementSize ? item.elementSize : 6} errmessage`}>
                                {
                                    getElement(item)
                                }
                            </div>
                        </div>
                ))
            }

        </>
    )
}

export default GenerateElements;

