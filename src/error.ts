export default interface Error {
    status: number,
    message?: string,
    syscall: string,
    code: string

}