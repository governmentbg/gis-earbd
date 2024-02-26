export interface ISpecificConfig {
    version: number,
    urls : {
        edit: string,
        upload: string,
        download: string,
        delete: string,
        create: string
    },
    roles: {
		roles: Array<String>,
		edit: Array<String>,
		upload: Array<String>,
		preview: Array<String>,
		delete: Array<String>
	},
    specificDetailGroups: {
        [key:string] : ISpecificDetails;
    }
}

export interface ISpecificDetails {
    editable: boolean,
    editmGroup?: string,
    upload: boolean,
    create?: boolean,
    sourceTablem:string,
    mGroups: Array<IOperationalmOptions>
}

export interface IOperationalmOptions {
    id: string,
    linkField: string,
    parentField: string,
    editable: boolean,
    editmGroup?: string,
    sourceTablem:string,
    upload: boolean,
    create?: boolean,
    intersects?:boolean,
    
}