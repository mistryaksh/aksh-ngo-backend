export interface INgoProfileProps {
  description: string;
  vision: string;
  mission: string;
  active?: boolean;
  director: IDirectorProps[];
}

export interface IDirectorProps {
     name: string;
     description: string;
     image: string;
}
