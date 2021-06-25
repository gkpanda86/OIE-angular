import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  loginForm: FormGroup;
  error: string;
  state: string;
  authenticators: any[];
  authToken: string;
  answer: string;
  challengeType:string;
  canSkip: boolean;
  phone: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.state = 'signup';
    this.canSkip = false;
  }

  onSubmit(){
    
    //console.log("submitted", this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
    this.authService.register(this.loginForm.get('firstName')?.value, this.loginForm.get('lastName')?.value, 
          this.loginForm.get('email')?.value).subscribe((resp : any)=> {
      console.log(resp.headers.get("X-Auth-Token"))
      this.authToken = resp.headers.get("X-Auth-Token");
      const body = resp.body;
      this.handleResponse(body);
      

    });
  }

  selectFactor(auth:any){
    console.log('>>>> ', auth);
    this.challengeType = auth.label;
    this.authService.enrollFactor(auth.label, this.authToken).subscribe((x:any) => {
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
    this.canSkip = response?.canSkip;
    this.answer = '';
  }

  skip(){
    this.authService.skip(this.authToken).subscribe(x => {
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

  submitPhone(){
    this.authService.enrollPhone(this.phone, this.authToken).subscribe((x:any) => {
      console.log(x);
      this.handleResponse(x);
    })
  }

}
