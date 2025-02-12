import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { AlertsService } from '../service/alerts.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  user: User = new User()
  confirmarSenha: string
  genero: string

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertsService
  ) { }

  ngOnInit(){
    window.scroll(0,0)
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  generoUser(event: any) {
    this.genero = event.target.value
  }

  cadastrar() {
    this.user.gender = this.genero

    if (this.user.password != this.confirmarSenha) {
      this.alert.showAlertDanger('As senhas estão diferentes!')
    } else {
      this.authService.cadastrar(this.user).subscribe((resp: User) => {
        this.user = resp

        this.router.navigate(['/login-page'])

        this.alert.showAlertSuccess('Usuário cadastrado com sucesso!')
      }, erro => {

        if (erro.status == 303) {
          this.alert.showAlertDanger("O nome não pode conter caracteres especiais")
        } else if (erro.status == 403) {
          this.alert.showAlertDanger("O email possui caracteres inválidos")
        } else if (erro.status == 405) {
          this.alert.showAlertDanger("O nome de usuário não pode conter caracteres especiais")
          console.clear()
        } else {
          this.alert.showAlertYellow("Dados incorretos ou nome de usuário e/ou email já estão sendo utilizados")
        }

      })
    }
  }

}
