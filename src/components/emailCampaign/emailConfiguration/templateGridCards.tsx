import React, { useState } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TemplatePreview from "../template/templatePreview";
import { CardActionArea, makeStyles } from "@material-ui/core";
import { EmailTemplate } from "../../../models/emailTemplate";

type params = {
  templateItem: EmailTemplate;
};

const useStyles = makeStyles({
    selected: {
      border: "1px solid green"
    }
  });

const TemplateGridCards = (props: params) => {
  const { templateItem, ...others } = props;
  const [showPreview, setShowPreview] = useState(true);
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState();

  return (
    <div
    //   onMouseOver={(e: any) => setShowPreview(true)}
    //   onMouseLeave={(e: any) => setShowPreview(false)}
    >
        templateItem.id - {templateItem.id} - selectedId - {selectedId}
      <Card className={(templateItem.id === selectedId ? classes.selected : null) as any}>
        <CardActionArea onClick={(e)=>setSelectedId(templateItem.id as any)}>
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
            hidden={showPreview}
            size="small"
            onClick={() => console.log("")}
          ></Button>
          <Button
            hidden={!showPreview}
            size="small"
            onClick={() => console.log("")}
          >
            Preview
          </Button>
        </CardActions>
        <CardContent>
          <TemplatePreview selectedItem={templateItem} />
        </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default TemplateGridCards;
