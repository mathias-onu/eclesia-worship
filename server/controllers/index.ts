import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Verse from '../models/BibleVerse.js';
import fetch from 'node-fetch';

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await fetch('https://api.dropbox.com/oauth2/token', {
      body: `grant_type=refresh_token&refresh_token=${process.env.DROPBOX_REFRESH_TOKEN}&client_id=${process.env.DROPBOX_CLIENT_ID}&client_secret=${process.env.DROPBOX_CLIENT_SECRET}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const data = await response.json();
    res.json(data);
  }
);

export const getLocalBible = asyncHandler(async (req: Request, res: Response) => {
  const { passage } = req.query;
  if (!passage) {
    res.status(400);
    throw new Error('Please enter a valid passage');
  }

  const reference = passage.toString().trim().split(' ');

  if (!reference || reference.length < 1) {
    res.status(400);
    throw new Error('Please enter a valid passage');
  }

  let bookReference: string = ""
  let versesReference: string = ""

  if(reference.length === 3) {
    bookReference = reference[0] + " " + reference[1]
    versesReference = reference[2]
  } else {
    bookReference = reference[0];
    versesReference = reference[1];
  }

  if (versesReference.split(':').length > 1) {
    const chapter: string = versesReference.split(':')[0];
    const verse: string = versesReference.split(':')[1];

    if (verse.split('-').length > 1) {
      const lowerBound: number = parseFloat(verse.split('-')[0]);
      const upperBound: number = parseFloat(verse.split('-')[1]);

      const finalVerses = [];
      for (let i = lowerBound; i <= upperBound; i++) {
        const currentVerse = await Verse.find({
          book: bookReference,
          chapter,
          number: i,
        });
        if (currentVerse.length > 0) {
          finalVerses.push(currentVerse[0]);
        }
      }

      res.json(finalVerses);
    } else {
      if (Number.isNaN(parseFloat(verse))) {
        res.status(400);
        throw new Error('Please enter a valid passage');
      }

      const verses = await Verse.find({
        book: bookReference,
        chapter,
        number: verse,
      }).sort({ number: 1 });
      res.json(verses);
    }
  } else {
    const verses = await Verse.find({
      book: bookReference,
      chapter: versesReference,
    }).sort({ number: 1 });
    res.json(verses);
  }
  
})

export const getBible = asyncHandler(async (req: Request, res: Response) => {
  const { passage } = req.query;

  const bible = await fetch(
    `https://bible-api.com/${passage}?translation=rccv`
  );
  const response = await bible.json();

  res.send(response);
});
