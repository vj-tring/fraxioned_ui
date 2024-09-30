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
        height: 300,
        overflowY: "scroll",
        borderRadius: "10px",
        // boxShadow: "none",
        // border:'1px solid #ccc',
      }}
    >
      <div>
        <CardContent
          sx={{
            padding: 1,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              textAlign: "left",
              fontWeight: "600",
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
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica with over
            6,000 species, ranging across all continents except Antarctica with
            over 6,000 species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="50"
          className="NewsImg mt-4"
          image={NewsImg}
          alt="green iguana"
        />
      </div>
    </Card>
  );
}
