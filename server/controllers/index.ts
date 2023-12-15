import asyncHandler from 'express-async-handler';
import fetch from 'node-fetch';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import MDBReader from 'mdb-reader';
import Verse from '../models/Verse.js';

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

export const importBible = asyncHandler(async (req: Request, res: Response) => {
  const buffer = readFileSync(
    'server/controllers/ESHB-RomanianDumitruCornilescu.mdb'
  );
  const reader = new MDBReader(buffer);

  const books = [
    {
      name: 'Geneza',
      chapters: 50,
    },
    {
      name: 'Exodul',
      chapters: 40,
    },
    {
      name: 'Leviticul',
      chapters: 27,
    },
    {
      name: 'Numeri',
      chapters: 36,
    },
    {
      name: 'Deuteronom',
      chapters: 34,
    },
    {
      name: 'Iosua',
      chapters: 24,
    },
    {
      name: 'Judecători',
      chapters: 21,
    },
    {
      name: 'Rut',
      chapters: 4,
    },
    {
      name: '1 Samuel',
      chapters: 31,
    },
    {
      name: '2 Samuel',
      chapters: 24,
    },
    {
      name: '1 Împărați',
      chapters: 22,
    },
    {
      name: '2 Împărați',
      chapters: 25,
    },
    {
      name: '1 Cronici',
      chapters: 29,
    },
    {
      name: '2 Cronici',
      chapters: 36,
    },
    {
      name: 'Ezra',
      chapters: 10,
    },
    {
      name: 'Neemia',
      chapters: 13,
    },
    {
      name: 'Estera',
      chapters: 10,
    },
    {
      name: 'Iov',
      chapters: 42,
    },
    {
      name: 'Psalmi',
      chapters: 150,
    },
    {
      name: 'Proverbe',
      chapters: 31,
    },
    {
      name: 'Eclesiastul',
      chapters: 12,
    },
    {
      name: 'Cântarea Cântărilor',
      chapters: 8,
    },
    {
      name: 'Isaia',
      chapters: 66,
    },
    {
      name: 'Ieremia',
      chapters: 52,
    },
    {
      name: 'Plângerile lui Ieremia',
      chapters: 5,
    },
    {
      name: 'Ezechiel',
      chapters: 48,
    },
    {
      name: 'Daniel',
      chapters: 12,
    },
    {
      name: 'Osea',
      chapters: 14,
    },
    {
      name: 'Ioel',
      chapters: 3,
    },
    {
      name: 'Amos',
      chapters: 9,
    },
    {
      name: 'Obadia',
      chapters: 1,
    },
    {
      name: 'Iona',
      chapters: 4,
    },
    {
      name: 'Mica',
      chapters: 7,
    },
    {
      name: 'Naum',
      chapters: 3,
    },
    {
      name: 'Habacuc',
      chapters: 3,
    },
    {
      name: 'Țefania',
      chapters: 3,
    },
    {
      name: 'Hagai',
      chapters: 2,
    },
    {
      name: 'Zaharia',
      chapters: 14,
    },
    {
      name: 'Maleahi',
      chapters: 4,
    },
    {
      name: 'Matei',
      chapters: 28,
    },
    {
      name: 'Marcu',
      chapters: 16,
    },
    {
      name: 'Luca',
      chapters: 24,
    },
    {
      name: 'Ioan',
      chapters: 21,
    },
    {
      name: 'Faptele Apostolilor',
      chapters: 28,
    },
    {
      name: 'Romani',
      chapters: 16,
    },
    {
      name: '1 Corinteni',
      chapters: 16,
    },
    {
      name: '2 Corinteni',
      chapters: 13,
    },
    {
      name: 'Galateni',
      chapters: 6,
    },
    {
      name: 'Efeseni',
      chapters: 6,
    },
    {
      name: 'Filipeni',
      chapters: 4,
    },
    {
      name: 'Coloseni',
      chapters: 4,
    },
    {
      name: '1 Tesaloniceni',
      chapters: 5,
    },
    {
      name: '2 Tesaloniceni',
      chapters: 3,
    },
    {
      name: '1 Timotei',
      chapters: 6,
    },
    {
      name: '2 Timotei',
      chapters: 4,
    },
    {
      name: 'Tit',
      chapters: 3,
    },
    {
      name: 'Filimon',
      chapters: 1,
    },
    {
      name: 'Evrei',
      chapters: 13,
    },
    {
      name: 'Iacov',
      chapters: 5,
    },
    {
      name: '1 Petru',
      chapters: 5,
    },
    {
      name: '2 Petru',
      chapters: 3,
    },
    {
      name: '1 Ioan',
      chapters: 5,
    },
    {
      name: '2 Ioan',
      chapters: 1,
    },
    {
      name: '3 Ioan',
      chapters: 1,
    },
    {
      name: 'Iuda',
      chapters: 1,
    },
    {
      name: 'Apocalipsa',
      chapters: 22,
    },
  ];

  const table = reader.getTable('BIBLE');

  for (let i = 0; i < table.getData().length; i++) {
    const verse = table.getData()[i];
    if (
      verse.BOOK !== 0 &&
      verse.BOOK !== null &&
      typeof verse.BOOK === 'number'
    ) {
      const newVerse = new Verse({
        book: books[verse.BOOK - 1].name,
        chapter: verse.CHAPTER,
        number: verse.VERSE,
        text: verse.BIBLETEXT,
      });

      await newVerse.save();
    }
  }

  res.send('success');
});

export const getBible = asyncHandler(async (req: Request, res: Response) => {
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

  const bookReference: string = reference[0];
  const versesReference: string = reference[1];

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
      });
      res.json(verses);
    }
  } else {
    const verses = await Verse.find({
      book: bookReference,
      chapter: versesReference,
    });
    res.json(verses);
  }
});
