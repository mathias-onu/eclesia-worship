import { Component, Inject, OnInit } from '@angular/core';
import { IBible, IBibleBook } from '../../../../shared/models/bible.model';
import { getBibleObj } from '../../../../shared/utils/bibleBooks';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-bible-books-dialog',
  templateUrl: './bible-books-dialog.component.html',
  styleUrl: './bible-books-dialog.component.scss'
})
export class BibleBooksDialogComponent implements OnInit {
  bibleBooks: IBible = getBibleObj()
  selectedBook: IBibleBook = getBibleObj().oldTestament[0]

  constructor(public dialogRef: DynamicDialogRef) { }

  ngOnInit(): void {

  }

  selectBook(book: IBibleBook) {
    this.selectedBook = book
  }

  selectPassage(bookTitle: string, bookChapter: number) {
    this.dialogRef.close({ data: `${bookTitle} ${bookChapter}` })
  }
}
