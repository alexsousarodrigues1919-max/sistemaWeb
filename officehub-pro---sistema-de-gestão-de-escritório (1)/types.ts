
export enum UserProfileType {
  ADMIN = 'ADMINISTRADOR',
  MEETING = 'REUNIÃO',
  SERVICE = 'ATENDIMENTOS',
  USER = 'USUÁRIO'
}

export interface User {
  id: string;
  fullName: string;
  login: string;
  password?: string;
  email: string;
  profile: UserProfileType;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  lastLogin?: string;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  sender: 'CLIENTE' | 'SUPORTE';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  clientId?: string;
  clientName: string;
  subject: string;
  description: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTO' | 'EM ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  assignedTo?: string; 
  messages?: TicketMessage[];
  unreadSupport: number; 
  unreadClient: number;  
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRating {
  id: string;
  ticketId?: string;
  clientId: string;
  clientName: string;
  score: number; 
  comment?: string;
  date: string;
}

export interface Professional {
  id: string;
  fullName: string;
  registration: string;
  councilId: string;
  specialty: string;
  email: string;
  phone: string;
  admissionDate: string;
  status: 'ATIVO' | 'AFASTADO' | 'DESLIGADO';
  salary?: string;
  commissionRate?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  description: string;
  value: string;
  dueDate: string;
  status: 'PAGO' | 'PENDENTE';
  paidAt?: string;
}

export interface ClientAccount {
  id: string;
  clientId: string;
  clientName: string;
  accountType: 'PRE-PAGO' | 'POS-PAGO' | 'MENSALISTA';
  status: 'REGULAR' | 'INADIMPLENTE' | 'SUSPENSO';
  balance: string;
  creditLimit: string;
  totalDebt: string; 
  dueDate: string;
  invoices: Invoice[]; // Lista de faturas pagas ou não
  notes?: string;
  createdAt: string;
}

export interface PhysicalPerson {
  id: string;
  type: 'FISICA';
  fullName: string;
  socialName?: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  maritalStatus: 'SOLTEIRO(A)' | 'CASADO(A)' | 'DIVORCIADO(A)' | 'VIUVO(A)' | 'UNIAO ESTAVEL';
  nationality: string;
  naturalness: string;
  profession: string;
  schooling: string;
  motherName: string;
  fatherName?: string;
  cpf: string;
  rg: string;
  rgIssuer: string;
  rgState: string;
  rgIssueDate: string;
  pisPasep?: string;
  cnhNumber?: string;
  cnhCategory?: string;
  phonePrincipal: string;
  mobile: string;
  whatsapp: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  observations?: string;
  createdAt: string;
}

export interface LegalPerson {
  id: string;
  type: 'JURIDICA';
  companyName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  openingDate: string;
  taxRegime: 'SIMPLES NACIONAL' | 'LUCRO PRESUMIDO' | 'LUCRO REAL' | 'MEI';
  cnaePrincipal: string;
  capitalSocial: string;
  comercialPhone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  website?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  responsibleName: string;
  responsibleCpf: string;
  responsibleRole: string;
  status: 'ATIVO' | 'INATIVO';
  observations?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  type: 'ANOTACAO' | 'COMPROMISSO' | 'LEMBRETE';
  title: string;
  description: string;
  personId?: string;
  eventDate: string;
  startTime: string;
  priority: 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';
  status: 'PENDENTE' | 'CONCLUIDO';
  createdAt: string;
}

export interface Planning {
  id: string;
  title: string;
  description: string;
  status: 'PLANEJADO' | 'EM ANDAMENTO' | 'CONCLUIDO';
  percentage: number;
  planType: 'PROJETO' | 'META' | 'ATIVIDADE';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  meetingType: 'ONLINE' | 'PRESENCIAL';
  status: 'AGENDADA' | 'REALIZADA';
}

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  startTime: string;
  appointmentType: 'PRESENCIAL' | 'ONLINE';
}
