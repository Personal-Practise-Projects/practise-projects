import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

    faqs: Object;

    constructor(private http: HttpClient) {
        this.http.get('https://jsonplaceholder.typicode.com/posts')

            .subscribe((response) => {
                console.log('response: ', response)
                console.log('response: ', typeof(response))

                this.faqs = response;


                console.log(this.faqs)
            });

    }

    ngOnInit() {
    }

}
