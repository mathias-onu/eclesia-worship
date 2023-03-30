import { Component, Inject, OnInit } from '@angular/core';
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
  selectedBook: IBibleBook = getBibleObj().oldTestament[0]
  bibleObj: any = getBibleObj()

  constructor(
    public dialogRef: MatDialogRef<BibleBooksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

  }

  selectBook(book: IBibleBook) {
    this.selectedBook = book
  }

  selectPassage(bookTitle: string, bookChapter: number) {
    this.dialogRef.close({ data: `${bookTitle} ${bookChapter}` })
  }
}
