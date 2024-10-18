// import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import CardActionArea from "@mui/material/CardActionArea";
import NewsImg from "../../assests/LivingRoom.jpg";
export default function NewsLetter() {
  return (
    <Card
      sx={{
        maxWidth: 900,
        padding: 2,
        height: 280,
        marginTop: "12px",
        marginBottom: "20px",
        overflowY: "scroll",
        borderRadius: "10px",
      }}
    >
      <div>
        <CardContent
          sx={{
            padding: 0.5,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              textAlign: "left",
              fontWeight: "600",
              fontSize: "medium",
            }}
            className="monsterrat"
          >
            October Newsletter
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "black", textAlign: "left" }}
            className="monsterrat mt-2"
          >
            Let your customers know how you celebrate Octoberfest or Halloween.
            Share tips to help your customers prepare for November emails
            (Thanksgiving Day) or winter. Get customers ready to close out their
            financial year. Share a fun autumn contest or giveaway. Discount
            fall merchandise.
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="50"
          className="NewsImg mt-2"
          image={NewsImg}
          alt="green iguana"
        />
      </div>
    </Card>
  );
}
