import { Component, OnInit } from '@angular/core';
import { TableService } from './table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private tableService: TableService) { }

  //array of numbers for result per page
  private optionsShow = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  //number if result per page
  private rowsPerPage: number = this.optionsShow[0];
  //array of buttons for the page
  private buttonsPage = [];
  //the number of current page
  private currentPage = -1;

  //start slice button for the button array
  private start = 0;
  //numbers of button on a page
  private numbersOfButtons = 2;
  //end slice button for the button array
  private end = this.start + this.numbersOfButtons;
  //boolean button back
  private buttonBackAvailable = false;
  //boolean button next
  private buttonNextAvailable = false;

  //the names of the columns
  private columsName = new Array();
  //the values of the table
  private rowsValues = new Array();

  private configClass = 'abc';

  ngOnInit() {
    this.tableService.configClassEmitter.subscribe(
      configClass => {
        this.configClass = configClass;
      }
    );

    //Emitter to send the config display of the page
    this.tableService.rowsConfigEmitter.emit({ rowsPerPage: this.rowsPerPage, numbersOfButtons: this.numbersOfButtons });
    //Emitter to get the buttons array
    this.tableService.buttonsPageEmitter.subscribe(
      buttonsPage => {
        this.buttonsPage = buttonsPage;
        //check if need to add the button next
        if (this.buttonsPage.length > this.numbersOfButtons) {
          this.buttonNextAvailable = true;
          if (this.currentPage == this.buttonsPage.length)
            this.buttonNextAvailable = false;
          // for (var i = this.numbersOfButtons -1; i >= 0; i--) {
          //   if ((this.buttonsPage.length - i == this.currentPage)) {
          //     this.buttonNextAvailable = false;
          //     break;
          //   }
          // }
        }
      }
    );
    //Emitter to get the data values for the table
    this.tableService.diplayDataEmitter.subscribe(
      data => {
        this.columsName = null;
        this.rowsValues = null;
        this.columsName = data.columsName;
        this.rowsValues = data.rowsValues;
      }
    );
  }

  //when we click on a row
  rowCLicked(rowValues) {
    this.tableService.rowClickedEmitter.emit(rowValues);
  }

  //Select to choose the number of result per page
  selectOptionsShow(event) {
    this.rowsPerPage = parseInt(event.target.value);
    this.buttonBackAvailable = false;
    this.buttonNextAvailable = false;
    this.start = 0;
    this.end = this.start + this.numbersOfButtons;
    this.tableService.rowsConfigEmitter.emit({ rowsPerPage: this.rowsPerPage, numbersOfButtons: this.numbersOfButtons });
  }

  //button back (display button)
  back() {
    if (this.start == 0)
      return;
    this.buttonNextAvailable = true;
    if (this.start - this.numbersOfButtons < 0) {
      this.start = 0;
      this.end = this.start + this.numbersOfButtons;
      this.buttonBackAvailable = false;
      return;
    }
    else {
      this.start -= this.numbersOfButtons
      this.end = this.start + this.numbersOfButtons;
      return;
    }

  }

  //button next (display button)
  next() {
    if (this.end >= this.buttonsPage.length) {
      return;
    }
    this.buttonBackAvailable = true;

    if (this.end + this.numbersOfButtons >= this.buttonsPage.length) {
      this.start = this.buttonsPage.length - this.numbersOfButtons;
      this.end = this.buttonsPage.length;
      this.buttonNextAvailable = false;
      return;
    }
    else {
      this.start += this.numbersOfButtons;
      this.end = this.start + this.numbersOfButtons;
      return;
    }


  }

  //when we click on a page
  pageClick(buttonPage) {
    if (this.currentPage == buttonPage)
      return;
    this.currentPage = buttonPage;
    this.tableService.loadPageEmitter.emit(buttonPage - 1);
  }
}
