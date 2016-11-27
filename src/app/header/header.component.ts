import { Component, OnInit } from '@angular/core';
import { ConfigService } from './../../services/config.service';
import { PageService } from './../../services/page.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ConfigService, PageService]
})
export class HeaderComponent implements OnInit {

  public admin = false;

  public logo;
  public banner;

  public pages= [
    {
      name: "Gallery",
      type: 2,
      position: 2,
      inNav: true
    },
    {
      name: "Activities",
      type: 1,
      position: 1,
      inNav: true
    },
    {
      name: "Home",
      type: 0,
      position: 0,
      inNav: true
    }
  ];
  public newPage = { name: "New page", description: "", type: 0, position: -1, inNav: true };
  public pageTypes = ["article", "activity", "gallery"];

  constructor(private configService: ConfigService, private pageService: PageService) { }

  ngOnInit() {
    this.getLogos();
    this.getPages();
  }

  getLogos(): void {
    this.configService.getLogo().then(logo => this.logo = logo);
    this.configService.getBanner().then(banner => this.banner = banner);
  }

  getPages() {
    this.pageService.getPages().then(res => {
      if(!res) { return; }
      this.pages = res.pages ? res.pages : this.pages;
      // for now display admin options if the api is on
      this.admin = res.pages ? true : false;
    });
  }

  addPage(type) {
    console.log("adding page " + this.newPage.name)

    this.newPage.type = type;
    this.newPage.position = this.pages.length;
    this.pageService.addPage(this.newPage).then(res => {
      if(!res) { return; }
      if(res.success) {
        this.pages.unshift(res.page);
        this.newPage = { name: "New page", description: "", type: 0, position: -1, inNav: true };
      }
    });
  }

  deletePage(i) {
    console.log("deleting page " + this.pages[i].name)
    this.pages.splice(i, 1)
  }

}
