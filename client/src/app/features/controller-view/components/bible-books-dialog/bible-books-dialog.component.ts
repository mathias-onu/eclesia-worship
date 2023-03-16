
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IBible, IBibleBook } from 'src/app/shared/models/bible.model';
import { getBibleObj } from 'src/app/shared/utils/bibleBooks';

@Component({
  selector: 'app-bible-books-dialog',
  templateUrl: './bible-books-dialog.component.html',
  styleUrls: ['./bible-books-dialog.component.scss']
})
export class BibleBooksDialogComponent implements OnInit {
  bibleBooks: IBible = getBibleObj()
  selectedBook: IBibleBook = {
    title: "Genesis",
    chapters: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50
    ]
  }
  bibleObj: any = getBibleObj()

  constructor(
    public dialogRef: MatDialogRef<BibleBooksDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

  }

  generateArray(bookChapters: number) {
    const chapters = []
    for (let i = 1; i <= bookChapters; i++) {
      chapters.push(i)
    }

    return chapters
  }

  selectBook(book: IBibleBook) {
    this.selectedBook = book
  }

  selectPassage(bookTitle: string, bookChapter: number) {
    this.dialogRef.close({ data: `${bookTitle} ${bookChapter}` })
  }
}
