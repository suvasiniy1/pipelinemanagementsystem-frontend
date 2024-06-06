import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ItemCollection from "../../../common/itemCollection";
import { Contact } from "../../../models/contact";
import { ContacteService } from "../../../services/contactService";
import ContactsAddEditDialog from "./contactsAddEditDialog";

const ContactsList = () => {
  const columnMetaData = [
    { columnName: "id", columnHeaderName: "Contact ID", width: 150 },
    { columnName: "name", columnHeaderName: "Name", width: 150 },
    { columnName: "email", columnHeaderName: "Email Address", width: 150 },
    { columnName: "phone", columnHeaderName: "Phone Number", width: 150 },
    {
      columnName: "updatedBy",
      columnHeaderName: "Last Modified By",
      width: 150,
    },
    {
      columnName: "updatedDate",
      columnHeaderName: "Last Modified Date",
      width: 150,
    },
  ];

  const contactSvc = new ContacteService(ErrorBoundary);
  const [rowData, setRowData] = useState<Array<Contact>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    contactSvc
      .getContacts()
      .then((res: Array<Contact>) => {
        if (res) {
          res.forEach((r) => {
            r = rowTransform(r);
          });
          setRowData([...res]);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setRowData([]);
        setIsLoading(false);
      });
  };

  const rowTransform = (item: Contact) => {
    ;
    item.name = item.firstName + " " + item.lastName;
    return item;
  };

  return (
    <ItemCollection
      itemName={"Contact"}
      rowData={rowData}
      isLoading={isLoading}
      itemType={Contact}
      columnMetaData={columnMetaData}
      viewAddEditComponent={ContactsAddEditDialog}
      onSave={(e: any) => loadData()}
      postDelete={(e: any) => loadData()}
      api={new ContacteService(ErrorBoundary)}
    />
  );
};

export default ContactsList;
