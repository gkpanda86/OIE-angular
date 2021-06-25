import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  authToken: string;
  answer: string;
  authenticators: any;
  state: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
    this.state = 'default';
  }

  onSubmit(){    
    console.log("submitted", this.loginForm.get('username')?.value);
    this.authService.recoverPassword(this.loginForm.get('username')?.value).subscribe((resp : any)=> {
      console.log(resp)
      this.authToken = resp.headers.get("X-Auth-Token");
      const body = resp.body;
      this.handleResponse(body);
      

    });
  }

  selectFactor(auth:any){
    console.log('>>>> ', auth);
    this.authService.selectFactor(auth.label, this.authToken).subscribe((x:any) => {
      console.log(x);
      this.handleResponse(x);
    })
  }

  answerChallenge(){
    console.log(this.answer);
    this.authService.answerChallenge(this.answer, this.authToken).subscribe(x => {
      console.log(x);
      this.handleResponse(x);
    })
  }

  handleResponse(response:any){
    if(response.status === 'SUCCESS'){
      localStorage.setItem('accessToken', response.tokens.accessToken)
      localStorage.setItem('idToken', response.tokens.idToken)
      this.router.navigateByUrl('')
    }
    this.authenticators = response?.authenticators
    this.state = response?.status;
    this.answer = '';
  }

}
