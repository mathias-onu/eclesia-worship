import dotenv from 'dotenv'
import BibleVerse from "../../server_dist/server/models/BibleVerse.js"
import connectDB from '../../server_dist/server/config/db.js'
import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'
import removeAccents from 'remove-accents';

dotenv.config()

connectDB()

const books = [
    {
        name: 'Geneza',
        chapters: 50
    },
    {
        name: 'Exodul',
        chapters: 40
    },
    {
        name: 'Leviticul',
        chapters: 27
    },
    {
        name: 'Numeri',
        chapters: 36
    },
    {
        name: 'Deuteronom',
        chapters: 34
    },
    {
        name: 'Iosua',
        chapters: 24
    },
    {
        name: 'Judecători',
        chapters: 21
    },
    {
        name: 'Rut',
        chapters: 4
    },
    {
        name: '1 Samuel',
        chapters: 31
    },
    {
        name: '2 Samuel',
        chapters: 24
    },
    {
        name: '1 Împărați',
        chapters: 22
    },
    {
        name: '2 Împărați',
        chapters: 25
    },
    {
        name: '1 Cronici',
        chapters: 29
    },
    {
        name: '2 Cronici',
        chapters: 36
    },
    {
        name: 'Ezra',
        chapters: 10
    },
    {
        name: 'Neemia',
        chapters: 13
    },
    {
        name: 'Estera',
        chapters: 10
    },
    {
        name: 'Iov',
        chapters: 42
    },
    {
        name: 'Psalmi',
        chapters: 150
    },
    {
        name: 'Proverbe',
        chapters: 31
    },
    {
        name: 'Eclesiastul',
        chapters: 12
    },
    {
        name: 'Cântarea Cântărilor',
        chapters: 8
    },
    {
        name: 'Isaia',
        chapters: 66
    },
    {
        name: 'Ieremia',
        chapters: 52
    },
    {
        name: 'Plângerile lui Ieremia',
        chapters: 5
    },
    {
        name: 'Ezechiel',
        chapters: 48
    },
    {
        name: 'Daniel',
        chapters: 12
    },
    {
        name: 'Osea',
        chapters: 14
    },
    {
        name: 'Ioel',
        chapters: 3
    },
    {
        name: 'Amos',
        chapters: 9
    },
    {
        name: 'Obadia',
        chapters: 1
    },
    {
        name: 'Iona',
        chapters: 4
    },
    {
        name: 'Mica',
        chapters: 7
    },
    {
        name: 'Naum',
        chapters: 3
    },
    {
        name: 'Habacuc',
        chapters: 3
    },
    {
        name: 'Țefania',
        chapters: 3
    },
    {
        name: 'Hagai',
        chapters: 2
    },
    {
        name: 'Zaharia',
        chapters: 14
    },
    {
        name: 'Maleahi',
        chapters: 4
    },
    {
        name: 'Matei',
        chapters: 28
    },
    {
        name: 'Marcu',
        chapters: 16
    },
    {
        name: 'Luca',
        chapters: 24
    },
    {
        name: 'Ioan',
        chapters: 21
    },
    {
        name: 'Faptele Apostolilor',
        chapters: 28
    },
    {
        name: 'Romani',
        chapters: 16
    },
    {
        name: '1 Corinteni',
        chapters: 16
    },
    {
        name: '2 Corinteni',
        chapters: 13
    },
    {
        name: 'Galateni',
        chapters: 6
    },
    {
        name: 'Efeseni',
        chapters: 6
    },
    {
        name: 'Filipeni',
        chapters: 4
    },
    {
        name: 'Coloseni',
        chapters: 4
    },
    {
        name: '1 Tesaloniceni',
        chapters: 5
    },
    {
        name: '2 Tesaloniceni',
        chapters: 3
    },
    {
        name: '1 Timotei',
        chapters: 6
    },
    {
        name: '2 Timotei',
        chapters: 4
    },
    {
        name: 'Tit',
        chapters: 3
    },
    {
        name: 'Filimon',
        chapters: 1
    },
    {
        name: 'Evrei',
        chapters: 13
    },
    {
        name: 'Iacov',
        chapters: 5
    },
    {
        name: '1 Petru',
        chapters: 5
    },
    {
        name: '2 Petru',
        chapters: 3
    },
    {
        name: '1 Ioan',
        chapters: 5
    },
    {
        name: '2 Ioan',
        chapters: 1
    },
    {
        name: '3 Ioan',
        chapters: 1
    },
    {
        name: 'Iuda',
        chapters: 1
    },
    {
        name: 'Apocalipsa',
        chapters: 22
    }
]

const buffer = readFileSync("server/scripts/ESHB-RomanianDumitruCornilescu.mdb")
const reader = new MDBReader(buffer)

const table = reader.getTable('BIBLE')

for(let i = 0; i < table.getData().length; i++) {
    const verse = table.getData()[i]
    if(typeof verse.BOOK === "number" && verse.BOOK !== 0) {
        const newVerse = new BibleVerse({
            book: removeAccents(books[verse.BOOK - 1].name),
            chapter: verse.CHAPTER,     
            number: verse.VERSE,
            text: verse.BIBLETEXT
        })

        await newVerse.save()
    }
}

console.log('Bible successfully imported')
