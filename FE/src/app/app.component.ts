import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title :any=[];
  constructor(private userService: UserService,private translate: TranslateService) {
    translate.setDefaultLang('en');
   }
  ngOnInit() {
    this.userService.showUser().subscribe((data) => {
      console.log(data);
      this.title= data;
    })
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }
}
