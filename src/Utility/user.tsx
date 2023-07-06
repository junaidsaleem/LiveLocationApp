class User {
    private id: string;
    private name: string;
    private latitude: number;
    private longitude: number;
  
    constructor(id: string, name: string, latitude: number, longitude: number) {
      this.id = id;
      this.name = name;
      this.latitude = latitude;
      this.longitude = longitude;
    }
  
    getId(): string {
      return this.id;
    }
  
    getName(): string {
      return this.name;
    }
  
    getLatitude(): number {
      return this.latitude;
    }
  
    getLongitude(): number {
      return this.longitude;
    }
  
    setLocation(latitude: number, longitude: number): void {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  }
  
  export default User;
  