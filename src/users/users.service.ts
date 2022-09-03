import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService, @InjectRepository(User) private usersRepository: Repository<User>) {}

  async create(code: string, createUserDto: CreateUserDto) {
    // if user already exists (every user has unique access token)
    const response = await this._sendPostRequest(code);
    if(response.error)
      return {error: `GitHub OAuth error: ${response.error_description}`, user: ''};
    var responseData = await this._sendGetRequest(response.access_token, 'https://api.github.com/user');
    var user = await this.usersRepository.findOneBy({'username': responseData.login});
    // else create a new user
    if(user==null) {
      user = this.usersRepository.create(createUserDto);
      user.code = code;
      user.username = responseData.login;
      user.avatar_url = responseData.avatar_url;
    }
    user.access_token = response.access_token;
    this.usersRepository.save(user);
    return {error: '', user: user};
  }

  async createRepo(access_token: string) {
    const user = await this.usersRepository.findOneBy({'access_token': access_token});

    // check if user has a repository with the name
    const repo_name = 'create-github-repo-app';
    try {
      await this._sendGetRequest(access_token,
        `https://api.github.com/repos/${user.username}/${repo_name}`);
      return {error: `Dear @${user.username}, you already have a repository named "github-create-repo-app".\n You may delete it and try again.`, user: user};
    } catch (error) {
      if(error.response.status!=404)
        return {error: error, user: user};
    }

    // create the repository
    const requestUrl = 'https://api.github.com/user/repos';
    const data = {
      'name': 'create-github-repo-app',
      'description': 'This repo was created using an API call.'
    };
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    };
    const response2 = await lastValueFrom(
      this.httpService.post(requestUrl, data, requestConfig).pipe(
        map((response) => { return response.data; }),
    ));
    if(response2.error)
      return {error: response2.error_description, user: user};

    // Push some files with content encoded in Base64
    const putURL = `https://api.github.com/repos/${user.username}/${repo_name}/contents/`;
    this._sendPutRequest(access_token, putURL+'File1.txt', 'SGVsbG8hCg==');
    this._sendPutRequest(access_token, putURL+'File2.txt', 'SGVsbG8gQWdhaW4gOikK');
    this._sendPutRequest(access_token, putURL+'File3.txt', 'R3JlZXRpbmdzISBeX14K');

    return {repo_link: response2.html_url, user: user};
  }

  _sendPostRequest(code: string) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json',
      },
      params: {
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'code': code
      },
    };
    const requestUrl = 'https://github.com/login/oauth/access_token';
    return lastValueFrom(
      this.httpService.post(requestUrl, null, requestConfig).pipe(
        map((response) => { return response.data; }),
      ));
  }

  _sendGetRequest(access_token: string, url: string) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${access_token}`
      }
    };
    return lastValueFrom(
      this.httpService.get(url, requestConfig).pipe(
        map((response) => { return response.data; }),
    ));
  }

  async _sendPutRequest(access_token: string, url: string, content: string, retries: number=5) {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json',
        'Authorization': `bearer ${access_token}`
      }
    };
    const data = {
      "message": "Automated commit",
      "committer": {
        "name":"Github Create Repo",
        "email":"noreply@github.com"
      },
      "content": content,
    }
    try {
      await lastValueFrom(
        this.httpService.put(url, data, requestConfig).pipe(
          map((response) => { return response.data; }),
      ));
    } catch(error) {
      // retry the request which might have failed due to race condition
      if(retries>0)
        return this._sendPutRequest(access_token, url, content, retries-1);
    }
  }
}
