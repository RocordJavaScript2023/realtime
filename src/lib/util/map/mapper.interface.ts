export interface Mapper<Input, Output> {
    mapToType(input: Input): Output;
}