export class CongratulatoryMessage {
  constructor(
    public username: string,
    public sprintCode: string,
    public gifUrl: string,
    public congratulatoryMessage: string,
    public sprintTitle: string,
    public timestamp: Date,
  ) {}
}
