import { IControl } from "../models/iControl";
import * as Yup from 'yup';

export default class Util {

    public static buildValidations=(controlsList: IControl[])=>{
        const validateObj = {};
        controlsList.filter(i=>!i.hidden ||  Util.isNullOrUndefinedOrEmpty(i.hidden)).map((field) => {
          if(field.isRequired && !field.disabled){
            if(field.min && !field.max){
              Object.assign(validateObj, {
                [field.value]: Yup
                  .string()
                  .required(`${field.key} is required`)
                  .min(field.min, `${field.key} must be atleast ${field.min} chars`)
                  .matches(field.regex1 ?? '', field.errMsg1)
                  .matches(field.regex2 ?? '', field.errMsg2)
                  .matches(field.regex3 ?? '', field.errMsg3)
                  .nullable(),
              });
            }
            if(field.max && !field.min){
              Object.assign(validateObj, {
                [field.value]: Yup
                  .string()
                  .required(`${field.key} is required`)
                  .max(field.max, `${field.key} must be max ${field.max} chars`)
                  .matches(field.regex1 ?? '', field.errMsg1)
                  .matches(field.regex2 ?? '', field.errMsg2)
                  .matches(field.regex3 ?? '', field.errMsg3)
                  .nullable(),
              });
            }
            if(!field.max && !field.min){
              Object.assign(validateObj, {
                [field.value]: Yup
                  .string()
                  .required(`${field.key} is required`)
                  .matches(field.regex1 ?? '', field.errMsg1)
                  .matches(field.regex2 ?? '', field.errMsg2)
                  .matches(field.regex3 ?? '', field.errMsg3)
                  .nullable(),
              });
            }
            if(field.min && field.max){
              Object.assign(validateObj, {
                [field.value]: Yup
                  .string()
                  .required(`${field.key} is required`)
                  .min(field.min, `${field.key} must be atleast ${field.min} chars`)
                  .max(field.max, `${field.key} must be max ${field.max} chars`)
                  .matches(field.regex1 ?? '', field.errMsg1)
                  .matches(field.regex2 ?? '', field.errMsg2)
                  .matches(field.regex3 ?? '', field.errMsg3)
                  .nullable(),
              });
            }
    
          }
          else{
            Object.assign(validateObj, {
              [field.value]: Yup
                .string()
                .nullable()
            });
          }
        });
        return validateObj;
      }

    public static isNullOrUndefined(list: any): boolean {
        return (list === null ||
            list === undefined);
    }

    public static isNullOrUndefinedOrEmpty(list: any): boolean {
        return (list === null ||
            list === undefined ||
            list.length === 0
        );
    }

    public static isListNullOrUndefinedOrEmpty(list: any): boolean {
        return (list === null ||
            list === undefined ||
            list.length === 0 ||
            (list.length === 1 && (list[0] === null || list[0] === ''))
        );
    }

    public static truncateValue(itemValue: string, size: number = 15): string {
        if (size < 4) return itemValue;
        if (itemValue && itemValue.length > size) {
            itemValue = itemValue.substring(0, size - 3) + "...";
        }
        return itemValue;
    }

    public static clone<T>(obj: T): T {
        let objJSONStr: string = JSON.stringify(obj);
        let parsedJSON = JSON.parse(objJSONStr);
        // let rtnClone: T = <T>Object.create(parsedJSON);
        let rtnClone: T = <T>(parsedJSON);
        // console.log("Clone - obj: ", obj, " | objJSONStr: ", objJSONStr, " | JSON.parse(objJSON): ", parsedJSON, " | rtnClone: ", rtnClone);
        console.log("clone - obj: ", obj, " | rtnClone: ", rtnClone);
        return rtnClone;
        // return <T>Object.create(JSON.parse(JSON.stringify(obj)));
        // return {...obj};
    }
}