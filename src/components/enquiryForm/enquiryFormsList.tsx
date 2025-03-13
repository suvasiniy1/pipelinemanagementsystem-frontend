import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../common/itemCollection";
import { EnquiryFormService } from "../../services/enquiryFormService";
import { EnquiryForm } from "../../models/enquiryForm";


const EnquiryFormList = () => {

    const columnMetaData = [
        { columnName: "firstName", columnHeaderName: "First Name", width: 100 },
        { columnName: "lastName", columnHeaderName: "Last Name", width: 100 },
        { columnName: "emailAddress", columnHeaderName: "Email", width: 100 },
        { columnName: "mobile", columnHeaderName: "Mobile", width: 100 },
        { columnName: "area", columnHeaderName: "Area", width: 100 },
        { columnName: "procedure", columnHeaderName: "Procedure", width: 100 },
        { columnName: "company", columnHeaderName: "Company", width: 100 },
        { columnName: "location", columnHeaderName: "Location", width: 100 },
        { columnName: "notes", columnHeaderName: "Notes", width: 100 },
        { columnName: "comments", columnHeaderName: "Comments", width: 100 },
    ];

    return (
        <ItemCollection
        
            itemName={"Enquiries"}
            canDoActions={false}
            canAdd={false}
            itemType={EnquiryForm}
            columnMetaData={columnMetaData}
            api={new EnquiryFormService(ErrorBoundary)}
            itemsBySubURL={"GetEnquiryForms"}
        />
    );
};

export default EnquiryFormList;
