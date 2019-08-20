import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Config, Columns, DefaultConfig, STYLE, THEME } from 'ngx-easy-table';
import { AuthorsService } from '../authors.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  public configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: true,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: false,
    selectRow: true,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: true,
    collapseAllRows: false,
    checkboxes: true,
    resizeColumn: false,
    fixedColumnWidth: true,
    horizontalScroll: false,
    draggable: false,
    logger: false,
    showDetailsArrow: false,
    showContextMenu: false,
    persistState: false,
    tableLayout: {
      style: STYLE.NORMAL,
      theme: THEME.LIGHT,
      borderless: false,
      hover: true,
      striped: false,
    },
  };

  public columns: Columns[] = [
    { key: 'firstName', title: 'First name' },
    { key: 'lastName', title: 'Last name' },
    { key: 'company', title: 'Company' }
  ];

  public data;

  constructor(private authorsService: AuthorsService) { }

  ngOnInit() {
    this.configuration = DefaultConfig;
    this.configuration.orderEnabled = true;

    this.data = this.authorsService.listAuthors();
  }

}
