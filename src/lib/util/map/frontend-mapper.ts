import { Mapper } from "./mapper.interface";

class FrontendMapper<Input, Output> implements Mapper<Input, Output> {

    mapToType(input: Input): Output {
        throw new Error("Method not implemented.");
    }
    
}