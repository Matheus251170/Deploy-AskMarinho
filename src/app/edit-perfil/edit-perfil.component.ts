import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { User } from '../model/User';
import { AlertsService } from '../service/alerts.service';
import { CommentService } from '../service/comment.service';
import { PostService } from '../service/post.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.css']
})
export class EditPerfilComponent implements OnInit {

  usuarioEnviado: User = new User()
  user: User = new User()
  confirmarSenha: string
  genero: string
  idUser: number
  numPosts: number
  numComments: number

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertsService,
    private userService: UserService,
    private commentService: CommentService,
    private postService: PostService
  ) { }

  ngOnInit() {
    if (environment.token == '') {

      this.router.navigate(['/login-page'])
      
    } else {
      this.userService.refreshToken()
      window.scroll(0,0)
      this.idUser = this.route.snapshot.params['id']
      this.findByIdUser(this.idUser)
    }
  }

  findByIdUser(id: number) {
    this.userService.getUserById(id).subscribe((resp: User) => {
      this.user = resp
    })
  }

  confirmSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  generoUser(event: any) {
    this.genero = event.target.value
  }  

  atualizar() {

    this.user.gender = this.genero

    if (this.user.password != this.confirmarSenha) {
      this.alert.showAlertDanger('As senhas estão diferentes!')
    } else {
      this.usuarioEnviado.gender = this.user.gender
      this.usuarioEnviado.description = this.user.description
      this.usuarioEnviado.email = this.user.email
      this.usuarioEnviado.birth = this.user.birth
      this.usuarioEnviado.idUser = this.user.idUser
      this.usuarioEnviado.name = this.user.name
      this.usuarioEnviado.password = this.user.password
      this.usuarioEnviado.urlImage = this.user.urlImage
      this.usuarioEnviado.userName = this.user.userName
      
      this.userService.refreshToken()

      this.userService.putUser(this.idUser, this.usuarioEnviado).subscribe((resp: User) => {
        this.user = resp

        this.router.navigate(['/login-page'])
        environment.token = ''
        environment.nome = ''
        environment.id = 0
        environment.foto = ''
        this.alert.showAlertSuccess('Usuario atualizado!')
      }, erro => {

        if (erro.status == 303) {
          this.alert.showAlertDanger("O nome não pode conter caracteres especiais")
        } else if (erro.status == 403) {
          this.alert.showAlertDanger("O email possui caracteres inválidos")
        } else if (erro.status == 405) {
          this.alert.showAlertDanger("O nome de usuário não pode conter caracteres especiais")
          console.clear()
        } else if (erro.status == 444) {
          this.alert.showAlertYellow("Já estão utilizando esse nome de usuário")
        } else if (erro.status == 406) {
          this.alert.showAlertYellow("Já estão utilizando esse email")
        } else {
          this.alert.showAlertYellow("Dados incorretos ou usuário já cadastrado")
        }

        
      })
    }
  }

  deleteConta() {


  if (this.user.comments.length > 0) {
    this.commentService.deleteAllComments(this.idUser).subscribe((resp: User) => {
      console.log("deletou comments")
      this.user = resp
    })
  }


  if(this.user.posts.length > 0) {
    this.postService.deleteAllPosts(this.idUser).subscribe((resp: User) => {
      console.log("deletou posts")
      this.user = resp
    })
  }


  if(this.user.reportComment.length > 0) {
    this.userService.deleteAllReportsComments(this.idUser).subscribe((resp: User) => {
      console.log("deletou reports comments")
      this.user = resp
    })
  }

  if(this.user.upvoteComment.length > 0) {
    this.userService.deleteAllUpvotesComments(this.idUser).subscribe((resp: User) => {
      console.log("deletou upvotes comments")
      this.user = resp
    })
  }

  if(this.user.reportPost.length > 0) {
    this.userService.deleteAllReportsPost(this.idUser).subscribe((resp: User) => {
      console.log("deletou reports posts")
      this.user = resp
    })
  }

  if(this.user.upvotePost.length > 0) {
    this.userService.deleteAllUpvotesPost(this.idUser).subscribe((resp: User) => {
      console.log("deletou upvotes posts")
      this.user = resp
    })
  }

  let i: number
  for (i = 0; i < 2; i++) {
        this.userService.refreshToken()
        this.userService.deleteUser(this.idUser).subscribe((resp: Object) => {

        }, deletou => {
          if (deletou.status == 200) {
            
            
            environment.token = ''
            environment.nome = ''
            environment.id = 0
            environment.foto = ''

            
            this.alert.showAlertSuccess("Usuário deletado com sucesso!")
            this.router.navigate(['/login-page'])  

            window.location.reload()      
            
          } else if (deletou.status == 500) {
            console.clear()
          } else if (deletou.status == 400) {
            this.alert.showAlertDanger("Usuário não existe")
          }
        })
    }
  }
  
}
