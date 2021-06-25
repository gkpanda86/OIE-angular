import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error: string;
  state: string;
  authenticators: any[];
  authToken: string;
  answer: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.state = 'login';
  }

  onSubmit(){
    
    console.log("submitted", this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
    this.authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe((resp : any)=> {
      console.log(resp.headers.get("X-Auth-Token"))
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

  resendCode(){
    this.authService.resendCode(this.authToken).subscribe((x:any) => {
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
    this.answer = '';
    this.authenticators = response?.authenticators
    this.state = response?.status;
  }

}

