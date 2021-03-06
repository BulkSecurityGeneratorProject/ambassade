import { BaseEntity, User } from './../../shared';

export class Paiement implements BaseEntity {
    constructor(
        public id?: number,
        public datePaiement?: any,
        public numeroPaiement?: string,
        public dateCreation?: any,
        public dateModification?: any,
        public visa?: BaseEntity,
        public passeport?: BaseEntity,
        public typeService?: BaseEntity,
        public user?: User,
        public uniteOrganisationelle?: BaseEntity,
        public createdBy?: User,
        public modifiedBy?: User,
    ) {
    }
}
