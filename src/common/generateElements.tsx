import SelectDropdown from "../elements/SelectDropdown";
import Slider from "../elements/Slider";
import TextArea from "../elements/TextArea";
import TextBox from "../elements/TextBox";
import { DATEPICKER } from "../elements/datePicker";
import RichTextEditor from "../elements/richTextEditor";
import {
  CustomActionPosition,
  ElementType,
  IControl,
} from "../models/iControl";

type props = {
  controlsList: Array<any>;
  selectedItem: any;
  onChange?: any;
  checked?: any;
  getListofItemsForDropdown?: (item: any) => {};
  disable?: boolean;
  getCustomElement?: any;
};
const GenerateElements: React.FC<props> = (props) => {
  const {
    controlsList,
    selectedItem,
    onChange,
    checked,
    getListofItemsForDropdown,
    disable,
    getCustomElement,
    ...others
  } = props;

  const getElement = (item: IControl) => {
    switch (item.type) {
      case ElementType.textarea:
        return (
          <TextArea item={item} selectedItem={selectedItem} disable={disable} />
        );
      case ElementType.slider:
        return (
          <Slider
            item={item}
            selectedItem={selectedItem}
            onChange={(e: any) => onChange && onChange(e, item)}
            checked={checked}
          />
        );
      case ElementType.dropdown:
        return (
          <SelectDropdown
            item={item}
            selectedItem={selectedItem}
            disable={disable}
            list={
              getListofItemsForDropdown &&
              (getListofItemsForDropdown(item) as any)
            }
            onItemChange={(e: any) => onChange(e, item)}
          />
        );
      case ElementType.datepicker:
        return (
          <DATEPICKER
            item={item}
            selectedItem={selectedItem}
            disable={disable}
            onChange={(e: any) => {
              onChange && onChange(e, item);
            }}
          />
        );
      case ElementType.ckeditor:
        return (
          <RichTextEditor
            item={item}
            selectedItem={selectedItem}
            onChange={(e: any) => {
              onChange && onChange(e, item);
            }}
            value={selectedItem[item.value]}
          />
        );
      case ElementType.custom:
        return getCustomElement(item);
      default:
        return (
          <TextBox
            item={item}
            selectedItem={selectedItem}
            disable={disable}
            onChange={(e: any) => {
              onChange && onChange(e, item);
            }}
          />
        );
    }
  };

  const customActionElement = (item: IControl) => {
    return (
      <>
        {item.customAction == CustomActionPosition.Right ? (
          <div className={item.actionName + " text-end"}>
            <a href="#">{item.actionName}</a>
          </div>
        ) : item.customAction == CustomActionPosition.Left ? (
          <div className={item.actionName}>
            <a href="#">{item.actionName}</a>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <>
      {controlsList.map((item: IControl, index: number) =>
        item.isControlInNewLine ? (
          <div key={index}>
            {!item.dependentChildren && !item.isDependentChildren ? (
              <div>
                <div className="form-group row" hidden={item.hidden}>
                  <label
                    htmlFor="name"
                    id={`labelFor_${item.value}`}
                    className={`col-sm-${
                      item.labelSize ? item.labelSize : 6
                    } col-form-label ${item.isRequired ? "required" : ""}`}
                  >
                    {item.key}:
                  </label>
                </div>
                <div className="form-group row">
                  <div
                    className={`col-sm-${
                      item.elementSize ? item.elementSize : 6
                    } errmessage`}
                  >
                    {getElement(item)}
                  </div>
                </div>
              </div>
            ) : !item.isDependentChildren ? (
              <div className="form-group row">
                <label
                  htmlFor="name"
                  id={`labelFor_${item.value}`}
                  className={`col-sm-${
                    item.labelSize ? item.labelSize : null
                  } col-form-label ${item.isRequired ? "required" : ""}`}
                >
                  {item.key}:
                </label>
                <div className="row">
                  <div className="col-md-6">
                    {getElement(item)}
                    {customActionElement(item)}
                  </div>
                  <div className="col-md-6">
                    {getElement(
                      controlsList.find((c) => c.key === item.dependentChildren)
                    )}
                    {customActionElement(
                      controlsList.find((c) => c.key === item.dependentChildren)
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : item.sidebyItem ? (
          <>
            <div className="form-group row" key={index} hidden={item.hidden}>
              <div className="col-6">
                <label
                  htmlFor="name"
                  id={`labelFor_${item.value}`}
                  className={`col-sm-${
                    item.labelSize ? item.labelSize : 6
                  } col-form-label ${item.isRequired ? "required" : ""}`}
                >
                  {item.key}:
                </label>
              </div>

              <div className="col-6">
                <label
                  htmlFor="name"
                  id={`labelFor_${controlsList.find(
                    (c) => c.key === item.sidebyItem
                  )}`}
                  className={`col-sm-${
                    controlsList.find((c) => c.key === item.sidebyItem)
                      ?.labelSize
                      ? controlsList.find((c) => c.key === item.sidebyItem)
                          ?.labelSize
                      : 6
                  } col-form-label ${
                    controlsList.find((c) => c.key === item.sidebyItem)
                      ?.isRequired
                      ? "required"
                      : ""
                  }`}
                >
                  {controlsList.find((c) => c.key === item.sidebyItem)?.key}:
                </label>
              </div>
            </div>

            <div className="form-group row">
              <div className="col-6">{getElement(item)}</div>
              <div className="col-6">
                {getElement(
                  controlsList.find((c) => c.key === item.sidebyItem)
                )}
              </div>
            </div>
          </>
        ) : item.isSideByItem ? null : (
          <div className="form-group row" key={index} hidden={item.hidden}>
            <label
              hidden={item.hideLabel}
              htmlFor="name"
              id={`labelFor_${item.value}`}
              className={`col-sm-${
                item.labelSize ?? 6
              } col-form-label ${item.isRequired ? "required" : ""}`}
            >
              {item.key}:
            </label>
            <div
              className={`col-sm-${
                item.elementSize ?? 6
              } errmessage`}
            >
              {getElement(item)}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default GenerateElements;
