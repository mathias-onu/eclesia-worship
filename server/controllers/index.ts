import asyncHandler from "express-async-handler";
import fetch from "node-fetch";
import { Request, Response } from "express"

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const response = await fetch("https://api.dropbox.com/oauth2/token", {
    body: `grant_type=refresh_token&refresh_token=${process.env.DROPBOX_REFRESH_TOKEN}&client_id=${process.env.DROPBOX_CLIENT_ID}&client_secret=${process.env.DROPBOX_CLIENT_SECRET}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const data = await response.json();
  res.json(data);
});

export const getBible = asyncHandler(async (req: Request, res: Response) => {
  const { passage } = req.query;

  const bible = await fetch(
    `https://bible-api.com/${passage}?translation=rccv`
  );
  const response = await bible.json();

  res.send(response);
});