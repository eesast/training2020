export type Department = "电子系";

export type Group = "admin";

export type Role = "root";

export interface IUser {
  id: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  phone: number;
  department: Department;
  class: string;
  group: Group;
  role: Role;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface IAuthState {
  loggedIn: boolean;
  loggingIn: boolean;
  error?: Error | null;
  token?: string;
  user?: IUser & {
    iat?: number;
    exp?: number;
  };
}

export interface IArticle {
  id: number;
  title: string;
  alias: string;
  author: string;
  authorId: number;
  abstract: string;
  image: string;
  content: string;
  views: number;
  likers: number[];
  tags: string[];
  createdAt: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface IComment {
  id: number;
  authorId: number;
  author: string;
  articleId: number;
  content: string;
  replyTo: number;
  likers: number[];
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export type ICommentState = IComment;

export interface IArticleState extends IArticle {}

export interface IWeeklyState {
  articles: {
    fetching: boolean;
    hasMore: boolean;
    error?: Error | null;
    items: IArticleState[];
  };
  comments: {
    fetching: boolean;
    error?: Error | null;
    items: ICommentState[];
  };
}

export interface ITeam {
  id: number;
  contestId: number;
  name: string;
  description: string;
  leader: number;
  members: number[];
  leaderInfo?: IUser;
  membersInfo?: IUser[];
  inviteCode?: string;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ITeamsState {
  fetching: boolean;
  contestId?: number;
  error?: Error | null;
  items: ITeam[];
  selfTeam: ITeam;
  totalTeams: number;
}

export interface IAppState {
  auth: IAuthState;
  weekly: IWeeklyState;
  teams: ITeamsState;
}
