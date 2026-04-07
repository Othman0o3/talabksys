import React from "react";
import { Link } from "react-router-dom";
import { FaTiktok } from "react-icons/fa6";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const SocialLinks = () => {
  return (
    <div className="social-links">
      <a href="https://www.facebook.com/talabk.Libya?mibextid=LQQJ4d">
        <FacebookIcon
          className="icon"
          style={{ fontSize: "2rem", color: "#1877F2" }}
        />
      </a>
      <a href="https://instagram.com/talabkly?igshid=YTQwZjQ0NmI0OA==">
        <InstagramIcon
          className="icon"
          style={{ fontSize: "2rem", color: "#E1306C" }}
        />
      </a>
      <a href="https://www.tiktok.com/@talabkly?_t=8hT9whtperN&_r=1">
        <FaTiktok
          className="icon"
          style={{ fontSize: "2rem", color: "#102002" }}
        />
      </a>
      <a href="https://www.linkedin.com/company/talabk/">
        <LinkedInIcon
          className="icon"
          style={{ fontSize: "2rem", color: "#0A66C2" }}
        />
      </a>
    </div>
  );
};

export default SocialLinks;
