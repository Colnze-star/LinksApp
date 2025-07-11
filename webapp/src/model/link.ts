export type Link = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;   
  updatedAt: Date;    
  owner_email?: string
};

export type ApiResponse = {
  content: Link[];          
  totalElements: number;    
  pageable: {              
    pageNumber: number;
    pageSize: number;
  };
}

export type FormUrl = {
  url: string;
}
