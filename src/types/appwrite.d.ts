declare module 'appwrite' {
  export class Client {
    setEndpoint(endpoint: string): this;
    setProject(project: string): this;
  }
  
  export class Databases {
    constructor(client: Client);
    createDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any>;
    listDocuments(databaseId: string, collectionId: string, queries?: string[]): Promise<{documents: any[]}>;
  }
  
  export class ID {
    static unique(): string;
  }
}