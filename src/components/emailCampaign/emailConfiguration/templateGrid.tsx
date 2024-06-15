import { Grid, CardActionArea, makeStyles } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EmailTemplate } from "../../../models/emailTemplate";
import { EmailTemplateService } from "../../../services/emailTemplateService";
import TemplateGridCards from "./templateGridCards";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TemplatePreview from "../template/templatePreview";
import { Spinner } from "react-bootstrap";

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

type params={
    selectedId:number;
    setSelectedId:any;
}
export const TemplateGrid = (props:params) => {
  const templateSvc = new EmailTemplateService(ErrorBoundary);
  const [rowData, setRowData] = useState<Array<EmailTemplate>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState(props.selectedId);

  useEffect(() => {
    templateSvc.getEmailTemplates().then((res: Array<EmailTemplate>) => {
      let itemList: Array<EmailTemplate> = [];
      res.forEach((i) => {
        let obj = {
          ...i,
          header: JSON.parse(i.header as any),
          body: JSON.parse(i.body as any),
          footer: JSON.parse(i.footer as any),
        };
        itemList.push(obj);
      });
      setRowData([...itemList]);
      setIsLoading(false);
    });
  }, []);

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
                  onClick={(e) => {setSelectedId(template.id as any); props.setSelectedId(template.id as any)}}
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
                    <Button size="small" onClick={() => console.log("")}>
                      Preview
                    </Button>
                  </CardActions>
                  <CardContent>
                    <TemplatePreview selectedItem={template} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};
