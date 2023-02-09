import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
} from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private searchSubject = new BehaviorSubject<string>('');
  items$: Observable<string[]>;
  isAdmin$: Observable<boolean>;
  userSearch: string;
  user: User;
  isFocus = false;

  constructor(
    private userService: UserService,
    private itemService: ItemsService,
    private visibleService: VisibilityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((u) => (this.user = u));
    this.searchSubject.subscribe((res) => (this.userSearch = res));
    this.isAdmin$ = this.userService.isAdmin$;

    this.items$ = combineLatest([
      this.searchSubject.pipe(debounceTime(300)),
      this.itemService.allItems$.pipe(
        map((items) => items.map((i) => i.name.toLowerCase()))
      ),
    ]).pipe(
      map(([searchWord, list]) =>
        list.filter((w) => w.includes(searchWord.toLowerCase()))
      )
    );
  }

  search() {
    if (!this.user) return;
    this.itemService.search(this.userSearch);
    this.searchSubject.next('');
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/home/login']);
  }

  change(item: string) {
    this.searchSubject.next(item);
    this.isFocus = true;
  }

  choose(item: string) {
    this.searchSubject.next(item);
    this.isFocus = false;
  }

  contact() {
    this.visibleService.openContact();
  }
}
