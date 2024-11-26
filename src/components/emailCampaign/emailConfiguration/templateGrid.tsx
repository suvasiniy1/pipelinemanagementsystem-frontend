import { Grid, CardActionArea, makeStyles } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmailTemplate } from "../../../models/emailTemplate";
import { EmailTemplateService } from "../../../services/emailTemplateService";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TemplatePreview from "../template/templatePreview";
import { Spinner } from "react-bootstrap";
import TemplatePreviewDialog from "./templatePreviewDialog";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles({
  selected: {
    border: "1px solid green",
  },
});

type params = {
  selectedId: number;
  setSelectedId: any;
  onTemplateSelect: (template: any) => void; 
};
export const TemplateGrid = (props: params) => {
  const templateSvc = new EmailTemplateService(ErrorBoundary);
  const [rowData, setRowData] = useState<Array<EmailTemplate>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState(props.selectedId);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>();

  useEffect(() => {
    templateSvc.getEmailTemplates().then((res: Array<EmailTemplate>) => {
      let itemList: Array<EmailTemplate> = [];
      res.forEach((i) => {
        let obj = {
          ...i,
          header: IsJson(i.header) ? JSON.parse(i.header as any) : i.header,
          body: IsJson(i.body) ? JSON.parse(i.body as any) : i.body,
          footer: IsJson(i.footer) ? JSON.parse(i.footer as any) : i.footer,
        };
        itemList.push(obj);
      }); 
      setRowData([...itemList]);
      setIsLoading(false);
    });
  }, []);

  function IsJson(str:any) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <Grid container spacing={2}>
          {rowData.map((template) => (
            <Grid key={template.id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                className={
                  (template.id === selectedId ? classes.selected : null) as any
                }
              >
                <CardActionArea
                  onClick={(e) => {
                    setSelectedId(template.id as any);
                    props.setSelectedId(template.id as any);
                    props.onTemplateSelect(template); 
                  }}
                >
                  <CardActions
                    sx={{
                      alignSelf: "stretch",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-start",
                      p: 0,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => console.log("")}
                    ></Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreview(true);
                      }}
                    >
                      Preview
                    </Button>
                  </CardActions>
                  <CardContent>
                    <TemplatePreview selectedItem={template} setHieghtWidth={true}/>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {showPreview && (
        <TemplatePreviewDialog
          dialogIsOpen={showPreview}
          setDialogIsOpen={setShowPreview}
          templateItem={selectedTemplate}
        />
      )}
    </>
  );
};
