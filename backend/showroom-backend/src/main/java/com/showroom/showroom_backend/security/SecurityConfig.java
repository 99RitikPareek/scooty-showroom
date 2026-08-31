package com.showroom.showroom_backend.security;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            CustomUserDetailsService userDetailsService) {

        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =====================================================
    // AUTHENTICATION PROVIDER
    // =====================================================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =====================================================
    // 401 UNAUTHORIZED
    // =====================================================

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {

        return (request, response, authException) -> {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");

            response.getWriter().write("""
                    {
                        "status": 401,
                        "error": "UNAUTHORIZED",
                        "message": "Authentication required"
                    }
                    """);
        };
    }

    // =====================================================
    // 403 FORBIDDEN
    // =====================================================

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {

        return (request, response, accessDeniedException) -> {

            response.setStatus(
                    HttpServletResponse.SC_FORBIDDEN
            );

            response.setContentType("application/json");

            response.getWriter().write("""
                    {
                        "status": 403,
                        "error": "FORBIDDEN",
                        "message": "Access denied"
                    }
                    """);
        };
    }

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf -> csrf.disable())

                // =================================================
                // CORS
                // =================================================
                // React:
                // http://localhost:5173
                //
                // Spring Boot:
                // http://localhost:8080
                //
                // Allows Spring Security to use CorsConfig
                // =================================================

                .cors(cors -> {})

                // =================================================
                // SESSION MANAGEMENT
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =================================================
                // AUTHENTICATION PROVIDER
                // =================================================

                .authenticationProvider(
                        authenticationProvider()
                )

                // =================================================
                // EXCEPTION HANDLING
                // =================================================

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint(
                                authenticationEntryPoint()
                        )

                        .accessDeniedHandler(
                                accessDeniedHandler()
                        )
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // =================================================
                        // CORS PREFLIGHT
                        // =================================================
                        // Browser sends OPTIONS before PUT/POST/DELETE
                        // =================================================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // =================================================
                        // AUTH
                        // =================================================

                        .requestMatchers(
                                "/api/auth/**",
                                "/api/customer/auth/send-otp",
                                "/api/customer/auth/verify-otp",
                                "/api/customer/auth/register",
                                "/api/customer/auth/login"
                        )
                        .permitAll()

                        // CUSTOMER PROFILE
                        .requestMatchers(
                                "/api/customer/auth/me"
                        )
                        .hasAnyRole("CUSTOMER", "ADMIN")

                        // Static Uploads
                        .requestMatchers(
                                "/uploads/**"
                        )
                        .permitAll()


                        // =================================================
                        // VEHICLES
                        // =================================================

                        // GET vehicles = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/vehicles/**"
                        )
                        .permitAll()

                        // POST vehicles = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/vehicles/**"
                        )
                        .hasRole("ADMIN")

                        // PUT vehicles = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/vehicles/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE vehicles = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/vehicles/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // VEHICLE IMAGES
                        // =================================================

                        // GET vehicle images = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/vehicles/*/images"
                        )
                        .permitAll()

                        // POST vehicle image = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/vehicles/*/images"
                        )
                        .hasRole("ADMIN")

                        // DELETE vehicle image = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/vehicles/*/images/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // BRANDS
                        // =================================================

                        // GET brands = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/brands/**"
                        )
                        .permitAll()

                        // POST brands = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/brands/**"
                        )
                        .hasRole("ADMIN")

                        // PUT brands = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/brands/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE brands = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/brands/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // OFFERS
                        // =================================================

                        // GET offers = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/offers/**"
                        )
                        .permitAll()

                        // POST offers = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/offers/**"
                        )
                        .hasRole("ADMIN")

                        // PUT offers = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/offers/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE offers = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/offers/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // TEST RIDES
                        // =================================================

                        // CREATE TEST RIDE = PUBLIC
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/test-rides"
                        )
                        .permitAll()

                        // GET TEST RIDES = ADMIN
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/test-rides/**"
                        )
                        .hasRole("ADMIN")

                        // UPDATE TEST RIDE = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/test-rides/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE TEST RIDE = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/test-rides/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // ENQUIRIES
                        // =================================================

                        // CREATE ENQUIRY = PUBLIC
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/enquiries"
                        )
                        .permitAll()

                        // GET ENQUIRIES = ADMIN
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/enquiries/**"
                        )
                        .hasRole("ADMIN")

                        // UPDATE ENQUIRY = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/enquiries/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE ENQUIRY = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/enquiries/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // CONTACT MESSAGES
                        // =================================================

                        // CREATE CONTACT MESSAGE = PUBLIC
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/contact-messages"
                        )
                        .permitAll()

                        // GET CONTACT MESSAGES = ADMIN
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/contact-messages/**"
                        )
                        .hasRole("ADMIN")

                        // UPDATE CONTACT MESSAGE = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/contact-messages/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE CONTACT MESSAGE = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/contact-messages/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // GALLERY
                        // =================================================

                        // GET gallery = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/gallery/**"
                        )
                        .permitAll()

                        // POST gallery = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/gallery"
                        )
                        .hasRole("ADMIN")

                        // PUT gallery = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/gallery/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE gallery = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/gallery/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // SHOWROOM SETTINGS
                        // =================================================

                        // GET showroom settings = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/showroom-settings"
                        )
                        .permitAll()

                        // POST showroom settings = ADMIN
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/showroom-settings"
                        )
                        .hasRole("ADMIN")

                        // PUT showroom settings = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/showroom-settings"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // SERVICE BOOKINGS
                        // =================================================

                        // CREATE SERVICE BOOKING = PUBLIC
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/service-bookings"
                        )
                        .permitAll()

                        // TRACK SERVICE BOOKING = PUBLIC
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/service-bookings/track/**"
                        )
                        .permitAll()

                        // GET SERVICE BOOKINGS = ADMIN
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/service-bookings/**"
                        )
                        .hasRole("ADMIN")

                        // UPDATE SERVICE BOOKING = ADMIN
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/service-bookings/**"
                        )
                        .hasRole("ADMIN")

                        // DELETE SERVICE BOOKING = ADMIN
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/service-bookings/**"
                        )
                        .hasRole("ADMIN")


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest()
                        .authenticated()
                )

                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}