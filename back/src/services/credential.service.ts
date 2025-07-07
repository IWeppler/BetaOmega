import bcrypt from "bcrypt";
import CredentialDto from "../dtos/credentialDto";
import { CredentialRepository } from "../repo/credential.repository";
import { Credential } from "../entities/Credential";

// Crear credencial (hash de la contraseña)
export const CredentialService = async (credentialDto: CredentialDto): Promise<Credential> => {
    const { password } = credentialDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const credential = CredentialRepository.create({ password: hashedPassword });
    await CredentialRepository.save(credential);
    return credential;
}

// Verificar contraseña ingresada contra la almacenada
export const checkPasswordService = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}